/*
 * GovBB design tokens — PLACEHOLDER BASELINE (single source of truth).
 *
 * TODO(#4): replace with the official GovBB design tokens once published.
 * The values below approximate the Barbados national palette so the docs site
 * has coherent branding to build against — they are NOT the final brand tokens.
 *
 * Both consumers derive from this file, so they never drift:
 *   - the Storybook manager theme (.storybook/theme.ts) reads `color`
 *   - the preview iframe injects `tokensCss()` as CSS custom properties
 */

export const color = {
  brand: '#00267f', // ultramarine
  brandAccent: '#ffc726', // gold
  ink: '#1a1a1a',
  surface: '#ffffff',
  muted: '#5c5c5c',
  border: '#d4d4d4',
} as const;

export const font = {
  sans: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  sizeBase: '1rem',
  lineHeightBase: '1.5',
} as const;

export const space = {
  1: '0.25rem',
  2: '0.5rem',
  3: '1rem',
  4: '1.5rem',
  5: '2rem',
} as const;

export const radius = '4px';

/**
 * Render the tokens as a `:root { --govbb-* }` custom-property block plus base
 * body styling, so the preview iframe inherits the GovBB baseline.
 */
export function tokensCss(): string {
  const vars = [
    `--govbb-color-brand: ${color.brand};`,
    `--govbb-color-brand-accent: ${color.brandAccent};`,
    `--govbb-color-ink: ${color.ink};`,
    `--govbb-color-surface: ${color.surface};`,
    `--govbb-color-muted: ${color.muted};`,
    `--govbb-color-border: ${color.border};`,
    `--govbb-font-sans: ${font.sans};`,
    `--govbb-font-size-base: ${font.sizeBase};`,
    `--govbb-line-height-base: ${font.lineHeightBase};`,
    `--govbb-space-1: ${space[1]};`,
    `--govbb-space-2: ${space[2]};`,
    `--govbb-space-3: ${space[3]};`,
    `--govbb-space-4: ${space[4]};`,
    `--govbb-space-5: ${space[5]};`,
    `--govbb-radius: ${radius};`,
  ].join('\n  ');

  return [
    `:root {\n  ${vars}\n}`,
    `body {\n  font-family: var(--govbb-font-sans);\n  line-height: var(--govbb-line-height-base);\n  color: var(--govbb-color-ink);\n}`,
  ].join('\n');
}
