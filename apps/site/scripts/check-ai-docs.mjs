import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const site = new URL('../', import.meta.url);
const root = new URL('../../../', import.meta.url);
const dist = new URL('dist/', site);
const read = (path, base = dist) => readFile(new URL(path, base), 'utf8');
const origin = (await read('astro.config.mjs', site)).match(
  /\bsite:\s*['"]([^'"]+)['"]/,
)?.[1];
assert(origin, 'Expected a site origin in astro.config.mjs');
const index = await read('llms.txt');
const links = [
  ...index.matchAll(/^- \[[^\n]+\]\((https:\/\/[^\s)]+)\): (.+)$/gm),
].map((match) => new URL(match[1]));
const paths = links.map((link) => link.pathname);
const expected = [];

assert(index.startsWith('# GovBB Design System\n\n> '));
assert.equal(new Set(paths).size, paths.length, 'Index links must be unique');
assert(index.includes('npx skills add govtech-bb/govbb-design-system --list'));
assert(index.includes('--skill design-system-compliance'));
assert(index.includes('initAll()'));
assert(index.includes('installed versions'));
for (const name of ['frontend', 'react']) {
  const pkg = JSON.parse(await read(`packages/${name}/package.json`, root));
  assert(
    index.includes(`${pkg.name}@${pkg.version}`),
    `${name} build version is missing`,
  );
}
for (const heading of [
  'Getting started',
  'Styles',
  'Components',
  'Patterns',
  'Templates',
  'AI skills',
  'Design decisions and research',
]) {
  assert(index.includes(`\n## ${heading}\n`), `${heading} is missing`);
}
for (const link of links) {
  assert.equal(link.origin, new URL(origin).origin);
  assert(link.pathname.endsWith('.md'), `Expected Markdown: ${link}`);
  assert(
    (await stat(new URL(link.pathname.slice(1), dist))).isFile(),
    `Missing: ${link}`,
  );
}

const metadata = (source) => source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const field = (source, name) =>
  metadata(source)
    .match(new RegExp(`^\\s*${name}:\\s*(.+)$`, 'm'))?.[1]
    .replace(/^['"]|['"]$/g, '');
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const tokenCss = await read('packages/frontend/src/tokens.css', root);
let tokenRows = 0;
let preservedFences = 0;

for (const [collection, route] of [
  ['docs', 'documentation'],
  ['styles', 'styles'],
  ['components', 'components'],
  ['patterns', 'patterns'],
  ['templates', 'templates'],
  ['design-log', 'design-log'],
]) {
  const content = new URL(`src/content/${collection}/`, site);
  const files = (await readdir(content, { recursive: true })).filter((name) =>
    name.endsWith('.md'),
  );
  for (const file of files) {
    const source = await read(file, content);
    const path = `/${route}/${file}`;
    const markdown = await read(path.slice(1));
    const html = await read(`${path.slice(1, -3)}/index.html`);
    expected.push(path);
    assert(
      markdown.startsWith(`# ${field(source, 'title')}\n`),
      `${path}: missing title`,
    );
    assert.match(html, /<link rel="describedby" href="\/llms.txt"/);
    assert(
      html.includes(
        `<link rel="alternate" type="text/markdown" href="${path}"`,
      ),
      `${path}: missing alternate`,
    );
    for (const [fence] of source.matchAll(
      /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm,
    )) {
      if (fence.startsWith('```token-')) continue;
      assert(markdown.includes(fence), `${path}: ordinary code fence changed`);
      preservedFences++;
    }
    if (collection === 'design-log') {
      assert(
        markdown.includes(`Date: ${field(source, 'date')}`),
        `${path}: missing date`,
      );
      assert(
        markdown.includes(`Kind: ${field(source, 'kind') ?? 'decision'}`),
        `${path}: missing kind`,
      );
    }
    if (collection === 'styles') {
      assert(
        !markdown.includes('```token-'),
        `${path}: unexpanded token fence`,
      );
      const rows = [
        ...markdown.matchAll(
          /^\| `(--govbb-[\w-]+)` \| `(.+?)` \| `(.+?)` \| (.*?) \|$/gm,
        ),
      ];
      const renderedRows = [
        ...html.matchAll(
          /<table\b[^>]*class="tokens"[^>]*>([\s\S]*?)<\/table>/g,
        ),
      ]
        .flatMap(([, table]) => [...table.matchAll(/<tr[ >][\s\S]*?<\/tr>/g)])
        .map(([row]) =>
          [...row.matchAll(/<code[^>]*>([\s\S]*?)<\/code>/g)].map((match) =>
            decode(match[1]),
          ),
        )
        .filter(([name]) => name?.startsWith('--govbb-'));
      assert.equal(
        rows.length,
        renderedRows.length,
        `${path}: HTML and Markdown token counts differ`,
      );
      rows.forEach(([, name, declared, resolved], i) => {
        assert.equal(name, renderedRows[i][0]);
        assert.equal(
          resolved,
          renderedRows[i].at(-1),
          `${name}: resolved value differs from HTML`,
        );
        const declaration = [
          ...tokenCss.matchAll(new RegExp(`${name}\\s*:\\s*([^;]+);`, 'g')),
        ].at(-1);
        assert(declaration, `${name}: token does not exist`);
        assert.equal(
          declared,
          declaration[1].replace(/\s+/g, ' ').trim(),
          `${name}: declared value differs from CSS`,
        );
      });
      tokenRows += rows.length;
    }
  }
}

const skills = new URL('skills/', root);
for (const directory of await readdir(skills, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  if (
    !(await readdir(new URL(`${directory.name}/`, skills))).includes('SKILL.md')
  )
    continue;
  const source = await read(`${directory.name}/SKILL.md`, skills);
  const path = `/ai-skills/${directory.name}.md`;
  if (
    (field(source, 'audience') ?? 'public') !== 'public' ||
    field(source, 'internal') === 'true'
  ) {
    assert(
      !paths.includes(path),
      `${directory.name}: private skill is indexed`,
    );
    await assert.rejects(stat(new URL(path.slice(1), dist)), {
      code: 'ENOENT',
    });
  } else {
    expected.push(path);
    assert.equal(
      await read(path.slice(1)),
      source,
      `${directory.name}: skill preview differs from entrypoint`,
    );
    const html = await read(`ai-skills/${directory.name}/index.html`);
    assert(
      html.includes(
        `<link rel="alternate" type="text/markdown" href="${path}"`,
      ),
    );
    assert(
      html.includes(
        `npx skills add govtech-bb/govbb-design-system --skill ${directory.name}`,
      ),
    );
    assert(!/\/plugin (?:install|marketplace add)|\/govbb:/.test(html));
    for (const [, target] of source.matchAll(
      /\[[^\]]+\]\(((?:\.\.?\/)?(?:references|scripts)\/[^)\s]+)\)/g,
    )) {
      const url = new URL(
        target,
        `https://github.com/govtech-bb/govbb-design-system/blob/main/skills/${directory.name}/SKILL.md`,
      );
      assert(
        html.includes(`href="${url}"`),
        `${directory.name}: broken supporting-file link ${target}`,
      );
      assert(
        (await stat(new URL(`${directory.name}/${target}`, skills))).isFile(),
      );
    }
    const examples = [...html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g)].map(
      ([, code]) => decode(code.replace(/<[^>]+>/g, '')).trim(),
    );
    for (const [, code] of source.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)) {
      assert(
        examples.includes(code.trim()),
        `${directory.name}: example code changed`,
      );
      preservedFences++;
    }
  }
}
assert.deepEqual(
  paths.toSorted(),
  expected.toSorted(),
  'Index must cover exactly the public content',
);
assert(
  paths.includes('/styles/typography/lists.md'),
  'Nested style route is missing',
);
const tokens = await read('styles/tokens.md');
assert(
  tokens.includes(
    '[View the interactive token example](/styles/tokens/#how-tokens-build-a-component)',
  ),
);
assert(tokens.includes('| `--govbb-color-brand` | `var(--govbb-blue-40)` |'));
assert((await read('styles/colour.md')).includes('on white ('));
assert((await read('styles/colour.md')).includes('| Aliased by |'));
assert(tokenRows > 0 && preservedFences > 0);
const home = await read('index.html');
const skillsOverview = await read('ai-skills/index.html');
assert(
  skillsOverview.includes(
    'npx skills add govtech-bb/govbb-design-system --list',
  ),
);
assert(!/\/plugin (?:install|marketplace add)|\/govbb:/.test(skillsOverview));
assert(skillsOverview.includes('href="/llms.txt"'));
assert.match(home, /<link rel="describedby" href="\/llms.txt"/);
assert(
  !home.includes('rel="alternate" type="text/markdown"'),
  'Home has no Markdown counterpart',
);
console.log(
  `AI docs passed: ${paths.length} links, ${tokenRows} token rows, ${preservedFences} preserved code fences (${fileURLToPath(dist)}).`,
);
