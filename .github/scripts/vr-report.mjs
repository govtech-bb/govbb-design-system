/*
 * Publishes a visual-regression failure as a PR comment with inline images.
 * Playwright leaves <name>-{expected,actual,diff}.png triplets in
 * test-results/; this pushes them to an orphan visual-report/pr-<N> branch
 * (so raw.githubusercontent.com can serve them — no external hosting) and
 * upserts one marker-tagged comment on the PR.
 *
 * Env: GH_TOKEN, PR (number), REPO (owner/name).
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { GH_TOKEN, PR, REPO } = process.env;
const RESULTS = 'packages/frontend/test-results';
const BRANCH = `visual-report/pr-${PR}`;
const MARKER = '<!-- vr-report -->';

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', ...opts });

// Collect every png, flattened; snapshot basenames are unique across specs.
const pngs = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.png')) pngs.push(path);
  }
};
walk(RESULTS);

// Group triplets by snapshot name.
const groups = new Map();
for (const path of pngs) {
  const match = /(.+)-(expected|actual|diff)\.png$/.exec(
    path.split('/').at(-1),
  );
  if (!match) continue;
  const [, name, kind] = match;
  if (!groups.has(name)) groups.set(name, {});
  groups.get(name)[kind] = path;
}
if (groups.size === 0) {
  console.log('no snapshot diffs found in test-results — nothing to report');
  process.exit(0);
}

// Push the images to the report branch (orphan, force — history is noise).
const dir = mkdtempSync(join(tmpdir(), 'vr-report-'));
for (const kinds of groups.values()) {
  for (const path of Object.values(kinds)) {
    cpSync(path, join(dir, path.split('/').at(-1)));
  }
}
const git = (...args) => sh('git', args, { cwd: dir });
git('init', '-q', '-b', 'report');
git('add', '-A');
git(
  '-c',
  'user.name=github-actions[bot]',
  '-c',
  'user.email=github-actions[bot]@users.noreply.github.com',
  'commit',
  '-qm',
  `visual report for #${PR}`,
);
git(
  'push',
  '-qf',
  `https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git`,
  `report:refs/heads/${BRANCH}`,
);

// Build the comment.
const raw = (file) =>
  `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURIComponent(file)}`;
const img = (kinds, kind) =>
  kinds[kind]
    ? `![${kind}](${raw(kinds[kind].split('/').at(-1))})`
    : '_(none)_';
const sections = [...groups.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([name, kinds]) => `<details><summary><code>${name}</code></summary>

| Expected | Actual | Diff |
| --- | --- | --- |
| ${img(kinds, 'expected')} | ${img(kinds, 'actual')} | ${img(kinds, 'diff')} |

</details>`,
  );
const body = `${MARKER}
### Visual regression report

**${groups.size}** snapshot(s) differ from the committed baselines.

${sections.join('\n')}

If these changes are intentional, run the **Update visual baselines** workflow on this branch to accept them.`;

// Upsert the marker comment.
writeFileSync(join(dir, 'body.md'), body);
const gh = (...args) =>
  sh('gh', args, { env: { ...process.env, GH_TOKEN } }).trim();
const existing = gh(
  'api',
  `repos/${REPO}/issues/${PR}/comments`,
  '--paginate',
  '--jq',
  `.[] | select(.body | startswith("${MARKER}")) | .id`,
);
if (existing) {
  gh(
    'api',
    '-X',
    'PATCH',
    `repos/${REPO}/issues/comments/${existing.split('\n')[0]}`,
    '-F',
    `body=@${join(dir, 'body.md')}`,
  );
} else {
  gh(
    'api',
    `repos/${REPO}/issues/${PR}/comments`,
    '-F',
    `body=@${join(dir, 'body.md')}`,
  );
}
console.log(`reported ${groups.size} changed snapshot(s) to PR #${PR}`);
