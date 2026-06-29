import { create } from 'storybook/theming';

import { color } from '../src/styles/tokens';

// GovBB branding for the Storybook manager UI. Colour values come from the
// shared placeholder token source (src/styles/tokens.ts) — the same source the
// preview uses for its CSS custom properties, so the two never drift.
export default create({
  base: 'light',
  brandTitle: 'GovBB Design System',
  brandUrl: 'https://design-system.gov.bb',
  brandTarget: '_self',
  colorPrimary: color.brand,
  colorSecondary: color.brand,
  appBg: color.surface,
  textColor: color.ink,
});
