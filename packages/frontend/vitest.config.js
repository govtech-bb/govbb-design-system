import { defineConfig } from 'vitest/config';
import { coverage } from '../../vitest.coverage.js';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // keep the playwright visual specs (visual/*.spec.ts) out of vitest
    include: ['src/**/*.test.js'],
    coverage: coverage({
      // the tailwind theme script ships its output, so it's measured too
      include: ['index.js', 'src/**/*.js', 'scripts/build-tailwind-theme.mjs'],
      thresholds: { statements: 85, branches: 55, functions: 75, lines: 90 },
    }),
  },
});
