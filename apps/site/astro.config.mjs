// @ts-check
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

// Bespoke, static documentation site for design-system.gov.bb.
// GOV.UK structure with GovBB branding — see docs/plans/123-scaffold-astro-site.md.
// astro-pagefind builds a static search index over the site (served at
// /pagefind/) and powers the /search/ results.
export default defineConfig({
  site: 'https://design-system.gov.bb',
  // No typographic substitutions: smartypants turns `--` into an en dash,
  // which mangles token names in inline SVG labels (e.g. `--tablet`) and
  // reintroduces dashes the house style bans.
  markdown: {
    smartypants: false,
  },
  integrations: [pagefind()],
  redirects: {
    '/documentation/layout': '/styles/layout',
    '/components/list': '/styles/typography/lists',
    '/styles/list': '/styles/typography/lists',
    '/components/payment': '/patterns/payment',
  },
});
