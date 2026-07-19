// "Get this page" links shown under an article's title: where the page's
// markdown source lives on GitHub, and the on-site raw-markdown route
// (the page URL + ".md", served by the [slug].md.ts endpoints).

const GITHUB_CONTENT_BASE =
  'https://github.com/govtech-bb/govbb-design-system/blob/main/apps/site/src/content';
const GITHUB_COMPONENT_BASE =
  'https://github.com/govtech-bb/govbb-design-system/blob/main/packages/frontend/src/components';

/** Guidance pages that share a single canonical component stylesheet. */
const COMPONENT_CSS_OVERRIDES: Record<string, string> = {
  checkbox: 'checkbox-radio/checkbox-radio.css',
  radio: 'checkbox-radio/checkbox-radio.css',
  fieldset: 'form/form.css',
  form: 'form/form.css',
  label: 'form/form.css',
};

/** Each article section's content directory and the URL base it serves from.
    They match except documentation, whose collection lives in content/docs. */
const SECTIONS = {
  components: { contentDir: 'components', urlBase: '/components' },
  patterns: { contentDir: 'patterns', urlBase: '/patterns' },
  styles: { contentDir: 'styles', urlBase: '/styles' },
  templates: { contentDir: 'templates', urlBase: '/templates' },
  documentation: { contentDir: 'docs', urlBase: '/documentation' },
} as const;

export interface PageSource {
  /** The relevant source file on GitHub (blob view, main branch). */
  sourceUrl: string;
  /** The on-site raw-markdown route for this page. */
  markdownUrl: string;
  /** The component's interactive Storybook documentation, when available. */
  storybookUrl?: string;
}

/** Derive both links from a section and a content entry id. Relies on the
    glob-loader ids matching the file paths (all our content files are already
    lowercase-hyphen, so id + ".md" is the path relative to the content dir). */
export function pageSource(
  section: keyof typeof SECTIONS,
  id: string,
): PageSource {
  const { contentDir, urlBase } = SECTIONS[section];
  return {
    sourceUrl: `${GITHUB_CONTENT_BASE}/${contentDir}/${id}.md`,
    markdownUrl: `${urlBase}/${id}.md`,
  };
}

/** Storybook uses the title `Components/<entry id>` for component docs, which
    produces a stable `components-<entry-id>--docs` route. */
export function componentPageSource(id: string): PageSource {
  const cssPath = COMPONENT_CSS_OVERRIDES[id] ?? `${id}/${id}.css`;
  return {
    ...pageSource('components', id),
    sourceUrl: `${GITHUB_COMPONENT_BASE}/${cssPath}`,
    storybookUrl: `/storybook/?path=/docs/components-${id}--docs`,
  };
}

/** What the .md routes serve: the entry's markdown body led by its frontmatter
    title and lede, so the file stands alone when pasted into an AI. */
export function entryMarkdown(entry: {
  body?: string;
  data: { title: string; lede?: string; description?: string };
}): string {
  const intro = entry.data.lede ?? entry.data.description;
  return (
    [`# ${entry.data.title}`, intro, entry.body?.trim()]
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
}

/** Response wrapper shared by every collection's [slug].md.ts endpoint. */
export function markdownResponse(
  entry: Parameters<typeof entryMarkdown>[0],
): Response {
  return new Response(entryMarkdown(entry), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
