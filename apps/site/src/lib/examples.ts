// Example sources, keyed by id. Every live example's markup is a file under
// src/examples/<collection>/…, the single source of truth rendered in the
// preview and shown in the code panel. An `<id>.html` may have an `<id>.tsx`
// twin holding the React source for the same example - its presence is what
// puts the React tab on the code panel, mirroring the filesystem the way a
// paired ```tsx fence used to follow its ```html fence.
//
// Ids are paths relative to src/examples/ without the extension, e.g.
// `components/button/variants` or `templates/landing`. Content markdown
// references them through `::example` directives (see lib/remark-example);
// scripts/check-examples.mjs keeps the references and the files in step.

const files = import.meta.glob('../examples/**/*.{html,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface ExampleSource {
  /** Example markup: rendered in the preview, shown in the HTML tab. */
  html: string;
  /** React source for the same example, shown in a React tab. */
  react?: string;
}

const byId = new Map<string, { html?: string; react?: string }>();
for (const [path, code] of Object.entries(files)) {
  const match = /\/examples\/(.+)\.(html|tsx)$/.exec(path);
  if (!match) continue;
  const [, id, ext] = match;
  const entry = byId.get(id) ?? {};
  entry[ext === 'html' ? 'html' : 'react'] = code.trim();
  byId.set(id, entry);
}

/** Example source for an id; fails the build when the markup is missing so a
    page can never ship a dangling example reference. */
export function getExample(id: string): ExampleSource {
  const entry = byId.get(id);
  if (!entry?.html) {
    throw new Error(`example "${id}": no markup - add src/examples/${id}.html`);
  }
  return { html: entry.html, react: entry.react };
}
