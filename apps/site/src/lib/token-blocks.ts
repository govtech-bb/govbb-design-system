// Turns a rendered content entry into an alternating list of prose chunks and
// token-table specs. Every ```token-table fence in the markdown holds simple
// `key: value` lines describing which tokens to show and how (see
// lib/tokens.ts `select()` for the selector forms); the corresponding <pre>
// in the rendered HTML is replaced with the TokenTable component. Other code
// fences are left in the prose untouched.

export interface TokenTableSpec {
  /** Selector passed to tokens.ts `select()`, e.g. `family teal`. */
  tokens: string;
  kind?: 'color' | 'space' | 'size' | 'radius' | 'plain';
  contrast?: boolean;
  aliases?: boolean;
  /** `aliased-by` swaps notes for the semantic tokens aliasing each shade. */
  notes?: string;
  label?: string;
}

export type TokenBlock =
  | { prose: string; table?: never; demo?: never }
  | { table: TokenTableSpec; prose?: never; demo?: never }
  | { demo: true; prose?: never; table?: never };

interface EntryLike {
  id: string;
  body?: string;
  rendered?: { html?: string };
}

function parseSpec(code: string, id: string): TokenTableSpec {
  const spec: Record<string, string> = {};
  for (const line of code.split('\n')) {
    if (!line.trim()) continue;
    const m = line.match(/^([\w-]+):\s*(.+)$/);
    if (!m) throw new Error(`${id}: bad token-table line: ${line}`);
    spec[m[1]] = m[2].trim();
  }
  if (!spec.tokens) throw new Error(`${id}: token-table fence needs "tokens:"`);
  return {
    tokens: spec.tokens,
    kind: spec.kind as TokenTableSpec['kind'],
    contrast: spec.contrast === 'true',
    aliases: spec.aliases === 'true',
    notes: spec.notes,
    label: spec.label,
  };
}

export function buildTokenBlocks(entry: EntryLike): TokenBlock[] {
  const fences = [
    ...(entry.body ?? '').matchAll(/^```([\w-]+)[^\n]*\n([\s\S]*?)^```/gm),
  ].map((m) => ({ lang: m[1], code: m[2] }));
  // Capturing split: parts alternate prose, <pre>, prose, <pre>, …, prose.
  const parts = (entry.rendered?.html ?? '').split(
    /(<pre[^>]*>[\s\S]*?<\/pre>)/,
  );
  if (parts.length !== fences.length * 2 + 1) {
    throw new Error(
      `${entry.id}: found ${fences.length} fences but ${(parts.length - 1) / 2} rendered code blocks`,
    );
  }

  const blocks: TokenBlock[] = [];
  let prose = parts[0];
  fences.forEach((fence, i) => {
    if (fence.lang === 'token-table') {
      blocks.push({ prose }, { table: parseSpec(fence.code, entry.id) });
      prose = parts[i * 2 + 2];
    } else if (fence.lang === 'token-demo') {
      blocks.push({ prose }, { demo: true });
      prose = parts[i * 2 + 2];
    } else {
      // An ordinary code fence: keep its highlighted <pre> in the prose.
      prose += parts[i * 2 + 1] + parts[i * 2 + 2];
    }
  });
  blocks.push({ prose });
  return blocks;
}
