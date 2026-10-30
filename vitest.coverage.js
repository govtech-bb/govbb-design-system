// coverage policy shared by the package vitest configs. Coverage only runs
// through `test:coverage` (root `pnpm test`, CI, pre-push); `vitest run` on a
// subset of tests stays green.
export const coverage = ({ thresholds, ...options }) => ({
  ...options,
  reporter: ['text'],
  // checked per file, so a new untested file fails the run even though the
  // package total barely moves. Each floor sits a few points under the
  // weakest file today.
  thresholds: { perFile: true, ...thresholds },
});
