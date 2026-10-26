import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // keep the playwright visual specs (visual/*.spec.ts) out of vitest
    include: ['src/**/*.test.js'],
    coverage: {
      include: ['index.js', 'src/**/*.js'],
      // a point or two under measured coverage, so one new uncovered line
      // doesn't fail the run but a real drop does
      thresholds: { statements: 92, branches: 85, functions: 91, lines: 95 },
    },
  },
});
