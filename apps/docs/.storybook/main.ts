import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  // MDX docs pages (guidelines/standards prose) + component stories.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    // Government repo — opt out of Storybook's anonymous usage telemetry.
    disableTelemetry: true,
  },
};

export default config;
