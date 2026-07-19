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
  vite: { build: { assetsInlineLimit: 0 } },
  markdown: {
    shikiConfig: {
      transformers: [
        {
          tokens(lines) {
            for (const line of lines) {
              for (const token of line) {
                if (token.color?.toLowerCase() === '#6a737d') {
                  token.color = '#8B949E';
                }
              }
            }
          },
        },
      ],
    },
  },
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
