import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/testing/**'],
      // a point or two under measured coverage, so one new uncovered line
      // doesn't fail the run but a real drop does
      thresholds: { statements: 96, branches: 94, functions: 96, lines: 97 },
    },
  },
});
