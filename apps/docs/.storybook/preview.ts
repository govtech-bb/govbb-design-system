import type { Preview } from '@storybook/web-components-vite';

import { tokensCss } from '../src/styles/tokens';

// GovBB styling baseline — inject the placeholder design tokens as CSS custom
// properties into the preview iframe. Generated from the shared token source
// (src/styles/tokens.ts) so the manager theme and the preview never drift.
const tokenStyles = document.createElement('style');
tokenStyles.textContent = tokensCss();
document.head.appendChild(tokenStyles);

const preview: Preview = {
  // Auto-generate a Docs page for every story by default.
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Run accessibility checks but surface them as TODOs rather than failures
    // while the component library is still being stubbed in.
    a11y: { test: 'todo' },
  },
};

export default preview;
