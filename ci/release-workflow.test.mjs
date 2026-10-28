import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';

const workflow = (name) =>
  parse(
    readFileSync(
      new URL(`../.github/workflows/${name}.yml`, import.meta.url),
      'utf8',
    ),
  );

test('preparation and publication serialize without replacing pending releases', () => {
  const prepare = workflow('prepare-release');
  const release = workflow('release');
  for (const value of [prepare, release]) {
    assert.deepEqual(value.concurrency, { group: 'release', queue: 'max' });
    assert.ok(Object.hasOwn(value.on, 'workflow_dispatch'));
    assert.deepEqual(value.permissions, { contents: 'read' });
  }
  assert.equal(prepare.jobs.prepare.if, "github.ref == 'refs/heads/main'");
  assert.equal(release.jobs.check.if, "github.ref == 'refs/heads/main'");
  const pr = prepare.jobs.prepare.steps.find((step) =>
    step.uses?.startsWith('peter-evans/create-pull-request@'),
  );
  assert.equal(pr.with.branch, 'release/next');
  assert.equal(pr.with.token, '${{ steps.app.outputs.token }}');
});

test('publication uses the checked source and exact artifact, with write permissions isolated', () => {
  const { jobs } = workflow('release');
  assert.deepEqual(jobs.checks.strategy.matrix.suite, [
    'ci',
    'storybook',
    'react-18',
  ]);
  for (const name of ['checks', 'pack', 'publish']) {
    const checkout = jobs[name].steps.find((step) =>
      step.uses?.startsWith('actions/checkout@'),
    );
    assert.equal(checkout.with.ref, '${{ needs.check.outputs.sha }}');
  }
  for (const name of ['check', 'checks', 'pack'])
    assert.equal(jobs[name].permissions, undefined);
  assert.deepEqual(jobs.publish.permissions, {
    contents: 'write',
    'id-token': 'write',
  });
  assert.deepEqual(jobs.pack.needs, ['check', 'checks']);
  assert.deepEqual(jobs.publish.needs, ['check', 'pack']);
  const download = jobs.publish.steps.find((step) =>
    step.uses?.startsWith('actions/download-artifact@'),
  );
  assert.equal(
    download.with['artifact-ids'],
    '${{ needs.pack.outputs.artifact_id }}',
  );
  assert.equal(download.with['merge-multiple'], true);
  const verify = jobs.publish.steps.findIndex((step) =>
    step.run?.startsWith('node ci/release.mjs verify'),
  );
  const reserve = jobs.publish.steps.findIndex((step) =>
    step.run?.includes('git push origin "$tag"'),
  );
  const publish = jobs.publish.steps.findIndex((step) =>
    step.run?.includes('node ci/release.mjs publish'),
  );
  assert.ok(verify >= 0 && verify < reserve && reserve < publish);
});
