import { defineConfig } from 'vite';

/*
 * Dev must compile CSS with the same engine as the build: breakpoints.css
 * uses @custom-media, which browsers don't implement — without this the
 * playground (and the visual-regression baselines shot from it) silently
 * drops every @media (--tablet/--mobile) rule.
 */
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: { drafts: { customMedia: true } },
  },
});
