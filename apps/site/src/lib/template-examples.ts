// Template example markup, keyed by slug. Each file under
// src/examples/templates/ is the single source of truth for one template's
// page: /examples/templates/[slug].astro renders it as a standalone page and
// templates/[slug].astro shows the same string in the docs code panel, so the
// preview and the copyable source can never drift apart.

const files = import.meta.glob('../examples/templates/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const templateExamples: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, html]) => [
    path.replace(/^.*\/([^/]+)\.html$/, '$1'),
    html.trim(),
  ]),
);

/** The standalone page for a template example (same-origin, chrome-less). */
export function exampleUrl(slug: string): string {
  return `/examples/templates/${slug}/`;
}

/** Example markup for a template page; fails the build when the partial is
    missing so a template can never ship without its preview. */
export function getTemplateExample(slug: string): string {
  const html = templateExamples[slug];
  if (!html) {
    throw new Error(
      `templates/${slug}: no example markup - add src/examples/templates/${slug}.html`,
    );
  }
  return html;
}
