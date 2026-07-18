// Turns a rendered content entry into an alternating list of prose chunks and
// live examples. Every ```html fence in the markdown is a live example: the
// fence content is taken verbatim from the raw markdown (entry.body), and the
// corresponding syntax-highlighted <pre> in the rendered HTML is replaced with
// the <Example> component (preview iframe + code panel). An optional
// title="…" in the fence meta labels the example. A ```tsx fence directly
// after an html fence joins the same example as its React tab — the preview
// always renders the HTML, which is exactly what the React wrappers emit.

export interface ExampleData {
  title?: string;
  html: string;
  react?: string;
  /** Whole-page example: render the preview full-bleed (no body padding) and
      taller. Opt in with a bare `page` token in the ```html fence meta. */
  page?: boolean;
}

export type Block =
  { prose: string; example?: never } | { example: ExampleData; prose?: never };

interface EntryLike {
  id: string;
  body?: string;
  rendered?: { html?: string };
}

interface BuildOptions {
  /** Put the first explanatory paragraph before the first Preview heading. */
  introBeforeFirstExample?: boolean;
}

export function buildExampleBlocks(
  entry: EntryLike,
  options: BuildOptions = {},
): Block[] {
  const fences = [
    ...(entry.body ?? '').matchAll(/^```(html|tsx)([^\n]*)\n([\s\S]*?)^```/gm),
  ].map((m) => ({
    lang: m[1],
    title: /title="([^"]*)"/.exec(m[2])?.[1],
    page: /(^|\s)page(\s|$)/.test(m[2]),
    code: m[3].trim(),
  }));
  const parts = (entry.rendered?.html ?? '').split(/<pre[^>]*>[\s\S]*?<\/pre>/);
  if (parts.length !== fences.length + 1) {
    throw new Error(
      `${entry.id}: found ${fences.length} html/tsx fences but ${parts.length - 1} rendered code blocks`,
    );
  }

  // Interleave prose chunks and examples, folding html+tsx fence pairs
  // (nothing but whitespace between them) into a single example.
  const blocks: Block[] = [{ prose: parts[0] }];
  for (let i = 0; i < fences.length; i++) {
    const fence = fences[i];
    if (fence.lang !== 'html') {
      throw new Error(
        `${entry.id}: \`\`\`tsx fence must directly follow an \`\`\`html fence`,
      );
    }
    const example: ExampleData = {
      title: fence.title,
      html: fence.code,
      page: fence.page,
    };
    if (fences[i + 1]?.lang === 'tsx' && parts[i + 1].trim() === '') {
      example.react = fences[i + 1].code;
      i++;
    }
    blocks.push({ example }, { prose: parts[i + 1] });
  }
  if (
    options.introBeforeFirstExample &&
    blocks[0]?.prose &&
    blocks[1]?.example &&
    blocks[2]?.prose
  ) {
    const match = /^\s*(<p>[\s\S]*?<\/p>)/.exec(blocks[2].prose);
    if (match) {
      return [
        { prose: match[1] },
        blocks[0],
        blocks[1],
        { prose: blocks[2].prose.slice(match[0].length) },
        ...blocks.slice(3),
      ];
    }
  }

  return blocks;
}
