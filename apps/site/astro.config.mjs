// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Bespoke, static documentation site for design-system.gov.bb.
// GOV.UK structure with GovBB branding — see docs/plans/123-scaffold-astro-site.md.
export default defineConfig({
  site: 'https://design-system.gov.bb',
  integrations: [mdx()],
});
