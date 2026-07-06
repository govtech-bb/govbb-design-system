import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // keep the playwright visual specs (visual/*.spec.ts) out of vitest
    include: ['src/**/*.test.js'],
  },
});
