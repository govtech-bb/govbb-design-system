// @ts-check
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

// Bespoke, static documentation site for design-system.gov.bb.
// GOV.UK structure with GovBB branding — see docs/plans/123-scaffold-astro-site.md.
// astro-pagefind builds a static search index over the site (served at
// /pagefind/) and powers the /search/ results.
export default defineConfig({
  site: 'https://design-system.gov.bb',
  integrations: [pagefind()],
  redirects: {
    '/documentation/layout': '/styles/layout',
    '/components/list': '/styles/typography',
    '/styles/list': '/styles/typography',
    '/components/payment': '/patterns/payment',
  },
});
