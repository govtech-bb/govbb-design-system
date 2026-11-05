import { defineConfig } from 'vitest/config';
import { coverage } from '../../vitest.coverage.js';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: coverage({
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/testing/**'],
      thresholds: { statements: 85, branches: 60, functions: 80, lines: 90 },
    }),
  },
});
