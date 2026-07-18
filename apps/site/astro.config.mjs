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
    '/changelog': '/design-log',
    '/changelog/[...slug]': '/design-log/[...slug]',
    '/documentation/layout': '/styles/layout',
    '/styles/list': '/styles/typography/lists',
    // NB: no /components/list or /components/payment redirects — both are real
    // component pages (list.md, payment.md). A redirect here outranks the
    // dynamic [slug] route and would shadow the component page.
  },
});
