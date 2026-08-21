/*
 * Build-time token catalogue, parsed from the design system's tokens.css
 * source so the docs can never drift from the shipped values. Used by the
 * TokenTable component on the Tokens and Colour pages.
 */
import tokensCss from '@govtech-bb/frontend/tokens.css?raw';

export interface Token {
  /** Custom property name, e.g. `--govbb-color-brand`. */
  name: string;
  /** Declared value, whitespace-normalised, e.g. `var(--govbb-blue-40)`. */
  value: string;
  /** Fully resolved value (aliases followed), e.g. `#00267f`. */
  resolved: string;
  /** Name of the token this one aliases, if the value is a single var(). */
  aliasOf?: string;
  /** Trailing block-comment note on the declaration, if any. */
  note?: string;
}

const declarations = new Map<string, { value: string; note?: string }>();

// Declarations can span lines (Prettier wraps long values), so match across
// newlines and normalise the whitespace afterwards. A comment directly after
// the semicolon is the token's note.
const DECL =
  /(--govbb-[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*([\s\S]*?)\s*\*\/)?/g;
for (const match of tokensCss.matchAll(DECL)) {
  const [, name, rawValue, rawNote] = match;
  const value = rawValue.replace(/\s+/g, ' ').trim();
  let note: string | undefined = rawNote?.replace(/\s+/g, ' ').trim();
  // Pure pixel-equivalent comments (e.g. `/* 4px */`) are redundant here:
  // the tables already compute the px value from the rem.
  if (note && /^\d+px$/.test(note)) note = undefined;
  declarations.set(name, { value, note });
}

const VAR_ALIAS = /^var\(\s*(--govbb-[\w-]+)\s*\)$/;

function resolve(value: string, seen = new Set<string>()): string {
  const alias = value.match(VAR_ALIAS);
  if (!alias) return value;
  const target = alias[1];
  if (seen.has(target)) return value; // cycle guard
  seen.add(target);
  const decl = declarations.get(target);
  return decl ? resolve(decl.value, seen) : value;
}

const all: Token[] = [...declarations.entries()].map(([name, decl]) => {
  const alias = decl.value.match(VAR_ALIAS);
  return {
    name,
    value: decl.value,
    resolved: resolve(decl.value),
    aliasOf: alias?.[1],
    note: decl.note,
  };
});

/** Tokens whose names start with the given prefix, e.g. `--govbb-space-`. */
export function byPrefix(prefix: string): Token[] {
  return all.filter((t) => t.name.startsWith(prefix));
}

/** Look up several tokens by exact name, keeping the given order. */
export function pick(...names: string[]): Token[] {
  return names.map((name) => {
    const token = all.find((t) => t.name === name);
    if (!token) throw new Error(`Unknown token: ${name}`);
    return token;
  });
}

/** The semantic colour tier: `--govbb-color-*` names that resolve to a colour. */
export const semanticColors = all.filter(
  (t) => t.name.startsWith('--govbb-color-') && isColor(t.resolved),
);

/** One primitive ramp family, e.g. `family('teal')` → teal-10 … teal-90. */
export function family(hue: string): Token[] {
  return all.filter((t) => new RegExp(`^--govbb-${hue}-\\d+$`).test(t.name));
}

export function isColor(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(value);
}

/** Which semantic tokens alias a primitive, keyed by the primitive's name. */
export const aliasedBy = new Map<string, string[]>();
for (const t of all) {
  if (t.aliasOf) {
    aliasedBy.set(t.aliasOf, [...(aliasedBy.get(t.aliasOf) ?? []), t.name]);
  }
}

/** Replace each token's note with the semantic tokens that alias it. */
export function withAliasNotes(list: Token[]): Token[] {
  return list.map((t) => ({ ...t, note: aliasedBy.get(t.name)?.join(', ') }));
}

/**
 * Resolve a ```token-table fence selector to tokens:
 *   `semantic-colors` · `prefix --govbb-space-` · `family teal` ·
 *   `pick --govbb-radius --govbb-opacity-disabled`
 */
export function select(selector: string): Token[] {
  const [op, ...args] = selector.trim().split(/[\s,]+/);
  switch (op) {
    case 'semantic-colors':
      return semanticColors;
    case 'prefix':
      return byPrefix(args[0]);
    case 'family':
      return family(args[0]);
    case 'pick':
      return pick(...args);
    default:
      throw new Error(`Unknown token selector: ${selector}`);
  }
}

// -- WCAG contrast (vs white), for the colour tables ---------------------

function channel(hex2: string): number {
  const c = parseInt(hex2, 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return (
    0.2126 * channel(h.slice(0, 2)) +
    0.7152 * channel(h.slice(2, 4)) +
    0.0722 * channel(h.slice(4, 6))
  );
}

/** Contrast ratio of a hex colour against white, e.g. 7.43. */
export function contrastOnWhite(hex: string): number {
  const l = luminance(hex);
  return (1 + 0.05) / (l + 0.05);
}

/** Pixel equivalent of a rem value at the 16px root, e.g. `1.5rem` → `24px`. */
export function remToPx(value: string): string | undefined {
  const rem = value.match(/^([\d.]+)rem$/);
  return rem ? `${parseFloat(rem[1]) * 16}px` : undefined;
}
