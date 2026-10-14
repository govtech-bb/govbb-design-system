#!/usr/bin/env node
/**
 * Builds the review's WCAG checklist from the W3C specification itself.
 *
 * The skill names no criteria, so the checklist always matches the version the
 * accessibility page names. This prints every success criterion at the target
 * level and the levels below it, word for word, plus the glossary definitions
 * those criteria use, and counts them so a short checklist is noticed.
 *
 *   node wcag-checklist.mjs --version 2.2 --level AA --out checklist.md
 *   node wcag-checklist.mjs --file saved-spec.html --level AA
 */

import { readFileSync, writeFileSync } from 'node:fs';

const HELP = `Usage:
  node wcag-checklist.mjs --version <x.y> --level <A|AA|AAA> [options]
  node wcag-checklist.mjs --file <spec.html> --level <A|AA|AAA> [options]

Options:
  --version <x.y>   WCAG version named by the accessibility page, fetched from
                    https://www.w3.org/TR/WCAG<xy>/ ("latest" fetches /TR/WCAG/)
  --url <url>       Fetch the specification from this URL instead
  --file <path>     Read a saved copy of the specification (for offline use)
  --level <level>   Target conformance level; lower levels are included
  --out <path>      Write the checklist here instead of standard output
  -h, --help
`;

const LEVELS = ['A', 'AA', 'AAA'];

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      console.log(HELP);
      process.exit(0);
    }
    const key = {
      '--version': 'version',
      '--url': 'url',
      '--file': 'file',
      '--level': 'level',
      '--out': 'out',
    }[arg];
    if (!key || argv[i + 1] === undefined) {
      console.error(`Unknown or incomplete option: ${arg}\n\n${HELP}`);
      process.exit(2);
    }
    opts[key] = argv[++i];
  }
  if (
    !LEVELS.includes(opts.level) ||
    !(opts.version || opts.url || opts.file)
  ) {
    console.error(HELP);
    process.exit(2);
  }
  return opts;
}

function specUrl({ version, url }) {
  if (url) return url;
  if (version === 'latest') return 'https://www.w3.org/TR/WCAG/';
  if (!/^\d+\.\d+$/.test(version))
    throw new Error(`"${version}" is not a WCAG version such as 2.2.`);
  return `https://www.w3.org/TR/WCAG${version.replace('.', '')}/`;
}

// ------------------------------------------------------------ HTML to text

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === '#'
      ? String.fromCodePoint(
          e[1] === 'x' || e[1] === 'X'
            ? parseInt(e.slice(2), 16)
            : Number(e.slice(1)),
        )
      : (ENTITIES[e.toLowerCase()] ?? m),
  );

/** Markdown-ish text that keeps every word of the source. */
function toText(html) {
  return decode(
    html
      .replace(/\s+/g, ' ')
      .replace(
        /<div role="heading" class="note-title[^>]*>.*?<span>(.*?)<\/span><\/div>/g,
        '\n\n$1: ',
      )
      .replace(/<dt[^>]*>/g, '\n\n**')
      .replace(/<\/dt>/g, '**\n')
      .replace(/<li[^>]*>/g, '\n- ')
      .replace(/<(p|div|dl|ul|ol|dd)[^>]*>/g, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\*\* +/g, '**')
    .replace(/ +\*\*\n/g, '**\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^(Note[^:\n]*): *\n\n/gm, '$1: ')
    .replace(/\n\n(?=- )/g, '\n')
    .trim();
}

const dfnRefs = (html) =>
  [...html.matchAll(/href="#(dfn-[^"]+)"/g)].map((m) => m[1]);

// ------------------------------------------------------------ parsing

function parseSpec(html) {
  const title = toText(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'WCAG');
  const status = toText(
    html.match(/<p id="w3c-state">([\s\S]*?)<\/p>/)?.[1] ?? '',
  );

  const starts = [
    ...html.matchAll(/<section id="([^"]+)" class="guideline">/g),
  ];
  const criteria = [];
  for (const [i, start] of starts.entries()) {
    const end =
      starts[i + 1]?.index ?? html.indexOf('<section', start.index + 1);
    const body = html.slice(start.index, end === -1 ? undefined : end);
    const heading = body.match(
      /<bdi class="secno">Success Criterion ([\d.]+)\s*<\/bdi>([\s\S]*?)<\/h\d>/,
    );
    if (!heading) continue; // a guideline, not a success criterion
    const name = toText(heading[2]);
    const level = body.match(
      /<p class="conformance-level">\(Level (A{1,3})\)/,
    )?.[1];
    const content = body
      .replace(/<div class="header-wrapper">[\s\S]*?<\/div>/, '')
      .replace(/<div class="doclinks">[\s\S]*?<\/div>/, '')
      .replace(/<p class="conformance-level">[\s\S]*?<\/p>/, '');
    criteria.push({
      id: start[1],
      number: heading[1],
      name,
      level,
      obsolete: /obsolete|removed/i.test(name),
      text: toText(content),
      refs: dfnRefs(content),
    });
  }
  const headings =
    html.match(/<bdi class="secno">Success Criterion /g)?.length ?? 0;

  const glossary = new Map();
  const glossaryStart = html.indexOf('<section id="glossary"');
  if (glossaryStart !== -1) {
    const section = html.slice(
      glossaryStart,
      html.indexOf('<section', glossaryStart + 1) >>> 0,
    );
    const entries = section.split(/(?=<dt[^>]*><dfn id=")/).slice(1);
    for (const entry of entries) {
      const id = entry.match(/<dfn id="([^"]+)"/)[1];
      const term = toText(entry.match(/<dt[^>]*>([\s\S]*?)<\/dt>/)?.[1] ?? id);
      const definition = entry.slice(entry.indexOf('</dt>') + 5);
      glossary.set(id, {
        term,
        text: toText(definition),
        refs: dfnRefs(definition),
      });
    }
  }
  return { title, status, criteria, headings, glossary };
}

function buildChecklist(spec, level) {
  const max = LEVELS.indexOf(level);
  const problems = [];
  if (spec.criteria.length === 0 || spec.criteria.length !== spec.headings)
    problems.push(
      `found ${spec.headings} success criterion headings but parsed ${spec.criteria.length}`,
    );
  for (const c of spec.criteria) {
    if (!c.level && !c.obsolete)
      problems.push(`${c.number} ${c.name} has no level`);
    if (!c.obsolete && !c.text)
      problems.push(`${c.number} ${c.name} has no text`);
  }
  const included = spec.criteria.filter(
    (c) => !c.obsolete && LEVELS.indexOf(c.level) <= max && c.level,
  );
  const skipped = spec.criteria.filter((c) => c.obsolete);

  const terms = [];
  const seen = new Set();
  const queue = included.flatMap((c) => c.refs);
  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    const entry = spec.glossary.get(id);
    if (!entry) {
      problems.push(`glossary term ${id} is referenced but not defined`);
      continue;
    }
    terms.push(entry);
    queue.push(...entry.refs);
  }
  terms.sort((a, b) => a.term.localeCompare(b.term));

  const counts = LEVELS.slice(0, max + 1).map(
    (l) => `${included.filter((c) => c.level === l).length} at Level ${l}`,
  );
  return { included, skipped, terms, counts, problems };
}

function render(spec, source, level, result) {
  const lines = [
    `# WCAG checklist: ${spec.title}, Level ${level}`,
    '',
    `Built from ${source}${spec.status ? ` (${spec.status})` : ''}.`,
    `${result.included.length} success criteria: ${result.counts.join(', ')}.` +
      (result.skipped.length
        ? ` Left out as obsolete or removed: ${result.skipped.map((c) => `${c.number} ${c.name}`).join('; ')}.`
        : ''),
    '',
    'Each criterion below is quoted from the specification. Judge findings against',
    'this text and the glossary definitions it links to, not against a summary.',
  ];
  for (const c of result.included)
    lines.push('', `## ${c.number} ${c.name} (Level ${c.level})`, '', c.text);
  lines.push('', '## Glossary terms these criteria use');
  for (const t of result.terms) lines.push('', `### ${t.term}`, '', t.text);
  return `${lines.join('\n')}\n`;
}

// ------------------------------------------------------------ main

const opts = parseArgs(process.argv.slice(2));
let html, source;
try {
  if (opts.file) {
    html = readFileSync(opts.file, 'utf8');
    source = opts.file;
  } else {
    source = specUrl(opts);
    const res = await fetch(source);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${source}`);
    html = await res.text();
  }
} catch (err) {
  console.error(
    `Could not read the specification: ${err.message}\n` +
      'There is no checklist. Pass --file with a saved copy of the specification, ' +
      'or report conformance findings as unconfirmed.',
  );
  process.exit(2);
}

const spec = parseSpec(html);
const result = buildChecklist(spec, opts.level);
if (result.problems.length) {
  console.error(
    `The checklist is incomplete, so do not rely on it:\n- ${result.problems.join('\n- ')}`,
  );
  process.exit(1);
}
const output = render(spec, source, opts.level, result);
if (opts.out) {
  writeFileSync(opts.out, output);
  console.log(
    `Wrote ${opts.out}: ${result.included.length} success criteria (${result.counts.join(', ')}), ` +
      `${result.terms.length} glossary terms, from ${spec.title}.`,
  );
} else process.stdout.write(output);
