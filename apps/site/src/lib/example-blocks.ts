// Turns a rendered content entry into an alternating list of prose chunks and
// live examples. Examples come from two sources, so pages can migrate one at
// a time:
//
// - `::example{id …}` directives (the canonical model): remark-example renders
//   each one as a self-describing placeholder div, and the markup is loaded
//   from src/examples/<collection>/<id>.html (+ optional .tsx twin for the
//   React tab) - see lib/examples.ts.
// - ```html fences (legacy, being migrated away): the fence content is taken
//   verbatim from the raw markdown (entry.body) and paired with the
//   corresponding <pre> in the rendered HTML. An optional title="…" in the
//   fence meta labels the example; a ```tsx fence directly after an html fence
//   joins the same example as its React tab.
//
// Either way the preview always renders the HTML, which is exactly what the
// React wrappers emit.

import { getExample } from './examples';

export interface ExampleData {
  title?: string;
  html: string;
  react?: string;
}

export type Block =
  { prose: string; example?: never } | { example: ExampleData; prose?: never };

interface EntryLike {
  id: string;
  body?: string;
  rendered?: { html?: string };
}

// One pass over the rendered HTML finds both kinds of example in document
// order: fence-rendered <pre> blocks and directive placeholder divs.
const MARKER =
  /<pre[^>]*>[\s\S]*?<\/pre>|<div data-example-block="([^"]+)"(?: data-title="([^"]*)")?><\/div>/g;

const unescapeAttr = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');

export function buildExampleBlocks(
  entry: EntryLike,
  /** Collection prefix for directive ids (`components` makes
      `id="button/variants"` resolve to components/button/variants). Pages
      whose content uses directives must pass it. */
  collection?: string,
): Block[] {
  const fences = [
    ...(entry.body ?? '').matchAll(/^```(html|tsx)([^\n]*)\n([\s\S]*?)^```/gm),
  ].map((m) => ({
    lang: m[1],
    title: /title="([^"]*)"/.exec(m[2])?.[1],
    code: m[3].trim(),
  }));
  const rendered = entry.rendered?.html ?? '';
  const markers = [...rendered.matchAll(MARKER)];
  const preCount = markers.filter((m) => m[1] === undefined).length;
  if (preCount !== fences.length) {
    throw new Error(
      `${entry.id}: found ${fences.length} html/tsx fences but ${preCount} rendered code blocks`,
    );
  }

  const blocks: Block[] = [];
  let cursor = 0;
  let fenceIndex = 0;
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    blocks.push({ prose: rendered.slice(cursor, marker.index) });
    cursor = marker.index + marker[0].length;

    if (marker[1] !== undefined) {
      // Directive placeholder: the id resolves against the page's collection.
      const id = unescapeAttr(marker[1]);
      if (!collection) {
        throw new Error(
          `${entry.id}: ::example{id="${id}"} needs the page to pass its collection to buildExampleBlocks`,
        );
      }
      blocks.push({
        example: {
          title: marker[2] === undefined ? undefined : unescapeAttr(marker[2]),
          ...getExample(`${collection}/${id}`),
        },
      });
      continue;
    }

    // Fence-rendered <pre>: pair with the next fence from the raw markdown.
    const fence = fences[fenceIndex++];
    if (fence.lang !== 'html') {
      throw new Error(
        `${entry.id}: \`\`\`tsx fence must directly follow an \`\`\`html fence`,
      );
    }
    const example: ExampleData = { title: fence.title, html: fence.code };
    // A tsx fence directly after (nothing but whitespace between the two
    // rendered code blocks) folds into the same example as its React tab.
    const next = markers[i + 1];
    if (
      fences[fenceIndex]?.lang === 'tsx' &&
      next?.[1] === undefined &&
      next !== undefined &&
      rendered.slice(cursor, next.index).trim() === ''
    ) {
      example.react = fences[fenceIndex++].code;
      cursor = next.index + next[0].length;
      i++;
    }
    blocks.push({ example });
  }
  blocks.push({ prose: rendered.slice(cursor) });
  return blocks;
}
