#!/usr/bin/env node
/**
 * Contrast ratios for the accessibility-review skill.
 *
 * Accepts hex colours or `--govbb-*` token names, which it resolves through
 * tokens.css (following var() chains) so you compare the values actually in
 * effect rather than remembered ones.
 *
 *   node contrast.mjs "#0e5f64" "#ffffff"
 *   node contrast.mjs govbb-color-interactive govbb-color-surface
 *   node contrast.mjs "#595959" "#fff" --size 16 --weight normal
 *   node contrast.mjs --tokens              # audit every semantic token on both surfaces
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `Usage:
  node contrast.mjs <colour> <colour> [options]
  node contrast.mjs --tokens [options]

Colours may be hex (#rgb, #rrggbb, #rrggbbaa) or a token name
(govbb-color-ink, --govbb-color-ink, color-ink).

Options:
  --size <px>          Rendered text size in CSS px. Omit and the stricter
                       normal-text threshold (4.5:1) is assumed — read the real
                       value with getComputedStyle(el).fontSize and pass it.
  --weight <w>         normal | bold (default normal)
  --non-text           Judge against the 3:1 non-text threshold (SC 1.4.11)
  --tokens             Audit semantic tokens against surface and ink
  --tokens-file <p>    Path to tokens.css (default: auto-detect in this repo)
  -h, --help
`;

// ---------------------------------------------------------------- colour maths

/** Parse a hex colour to [r,g,b] in 0..1. Alpha is rejected: compositing an
 *  alpha colour needs a known backdrop, and guessing one would fake a result. */
function parseHex(input) {
  let h = input.trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  if (h.length === 8)
    throw new Error(
      `"${input}" has an alpha channel. Composite it over its real backdrop first — a ratio against an unknown backdrop is meaningless.`,
    );
  if (h.length !== 6 || !/^[0-9a-f]{6}$/i.test(h))
    throw new Error(`"${input}" is not a hex colour or a known token name.`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

/** Relative luminance per WCAG 2.x. */
function luminance(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// ---------------------------------------------------------------- token lookup

function findTokensFile(explicit) {
  if (explicit) return resolve(explicit);
  // Walk up from this script looking for the frontend package's tokens.
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, 'packages/frontend/src/tokens.css');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** Parse `--name: value;` declarations. Last definition wins, matching the
 *  cascade for a single :root block. */
function parseTokens(css) {
  const tokens = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)[;}]/gi))
    tokens.set(m[1].toLowerCase(), m[2].trim());
  return tokens;
}

/** Resolve a token to a literal, following var() chains. */
function resolveToken(name, tokens, seen = new Set()) {
  const key = name.toLowerCase();
  if (seen.has(key)) throw new Error(`Token ${name} is circular.`);
  seen.add(key);
  const raw = tokens.get(key);
  if (raw === undefined) return null;
  const varMatch = raw.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)$/i);
  if (varMatch) return resolveToken(varMatch[1], tokens, seen);
  return raw;
}

/** Accept `govbb-color-ink`, `--govbb-color-ink`, or `color-ink`. */
function candidateNames(input) {
  const bare = input.trim().replace(/^--/, '');
  return [`--${bare}`, `--govbb-${bare}`];
}

function toRgb(input, tokens) {
  if (input.trim().startsWith('#')) return parseHex(input);
  if (tokens) {
    for (const name of candidateNames(input)) {
      const value = resolveToken(name, tokens);
      if (value) {
        if (!value.startsWith('#'))
          throw new Error(
            `Token ${name} resolves to "${value}", which is not a hex colour. Compute this one by hand against its real backdrop.`,
          );
        return parseHex(value);
      }
    }
  }
  return parseHex(input); // will throw with a useful message
}

// ------------------------------------------------------------------- verdicts

/** WCAG "large text": >=24px regular, or >=18.66px bold. */
function isLargeText(sizePx, weight) {
  return weight === 'bold' ? sizePx >= 18.66 : sizePx >= 24;
}

function verdict(ratio, { sizePx, weight, nonText, sizeAssumed }) {
  const r = Math.floor(ratio * 100) / 100; // don't round 4.499 up to a pass
  if (nonText) {
    return [
      `SC 1.4.11 Non-text Contrast (AA, needs 3:1): ${r >= 3 ? 'PASS' : 'FAIL'}`,
    ];
  }
  const large = isLargeText(sizePx, weight);
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  const lines = [];
  // Which threshold applies is the most common source of a wrong verdict, so be
  // explicit about whether it was measured or assumed. An assumed threshold is
  // not evidence — the skill's `computed` tag needs a real rendered size.
  if (sizeAssumed)
    lines.push(
      'Text size not given — assuming normal-size text, the stricter 4.5:1.',
      'For a defensible verdict, read the rendered size off the element',
      '(getComputedStyle(el).fontSize / .fontWeight) and pass --size/--weight.',
      '',
    );
  else
    lines.push(
      `Text at ${sizePx}px ${weight} counts as ${large ? 'LARGE' : 'normal'} text.`,
    );
  lines.push(
    `SC 1.4.3 Contrast Minimum (AA, needs ${aa}:1): ${r >= aa ? 'PASS' : 'FAIL'}`,
    `SC 1.4.6 Contrast Enhanced (AAA, needs ${aaa}:1): ${r >= aaa ? 'PASS' : 'fail'}`,
  );
  return lines;
}

// ----------------------------------------------------------------------- main

function parseArgs(argv) {
  // Default to a size below the large-text cutoff, so an omitted --size errs
  // toward the stricter 4.5:1 rather than quietly clearing something at 3:1.
  // sizeAssumed records that nobody measured, which the verdict reports.
  const opts = {
    sizePx: 16,
    weight: 'normal',
    nonText: false,
    sizeAssumed: true,
    colours: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--tokens') opts.auditTokens = true;
    else if (a === '--non-text') opts.nonText = true;
    else if (a === '--size') {
      opts.sizePx = Number(argv[++i]);
      opts.sizeAssumed = false;
    } else if (a === '--weight') opts.weight = argv[++i];
    else if (a === '--tokens-file') opts.tokensFile = argv[++i];
    else opts.colours.push(a);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (opts.help || (!opts.auditTokens && opts.colours.length !== 2)) {
  console.log(HELP);
  process.exit(opts.help ? 0 : 1);
}

if (!Number.isFinite(opts.sizePx) || opts.sizePx <= 0) {
  console.error('--size must be a positive number of CSS pixels.');
  process.exit(1);
}
if (!['normal', 'bold'].includes(opts.weight)) {
  console.error('--weight must be "normal" or "bold".');
  process.exit(1);
}

const tokensPath = findTokensFile(opts.tokensFile);
const tokens = tokensPath
  ? parseTokens(readFileSync(tokensPath, 'utf8'))
  : null;

if (opts.auditTokens) {
  if (!tokens) {
    console.error(
      'Could not find tokens.css. Pass --tokens-file <path> explicitly.',
    );
    process.exit(1);
  }
  console.log(`Tokens: ${tokensPath}\n`);
  const surfaces = [
    ['surface', '--govbb-color-surface'],
    ['ink', '--govbb-color-ink'],
  ];
  const semantic = [...tokens.keys()].filter((k) =>
    /^--govbb-(color|link)-/.test(k),
  );
  console.log('| Token | Value | vs surface | vs ink |');
  console.log('|---|---|---|---|');
  for (const name of semantic) {
    const value = resolveToken(name, tokens);
    if (!value || !value.startsWith('#')) continue;
    const rgb = parseHex(value);
    const cells = surfaces.map(([, tokenName]) => {
      const other = resolveToken(tokenName, tokens);
      if (!other || !other.startsWith('#')) return 'n/a';
      return `${contrast(rgb, parseHex(other)).toFixed(2)}:1`;
    });
    console.log(`| \`${name}\` | ${value} | ${cells[0]} | ${cells[1]} |`);
  }
  console.log(
    '\nRatios only. Whether each passes depends on what the colour is used for —\n' +
      'text size and weight, or the 3:1 non-text threshold. Check the use, not the number.',
  );
  process.exit(0);
}

try {
  const [aInput, bInput] = opts.colours;
  const a = toRgb(aInput, tokens);
  const b = toRgb(bInput, tokens);
  const ratio = contrast(a, b);
  const hex = (rgb) =>
    '#' +
    rgb
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');

  console.log(`${aInput} (${hex(a)})  on  ${bInput} (${hex(b)})`);
  console.log(
    `Contrast ratio: ${(Math.floor(ratio * 100) / 100).toFixed(2)}:1\n`,
  );
  for (const line of verdict(ratio, opts)) console.log(line);
  if (tokensPath && (!aInput.startsWith('#') || !bInput.startsWith('#')))
    console.log(`\nTokens resolved from ${tokensPath}`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
