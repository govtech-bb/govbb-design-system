import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const previous = '1.0.0-alpha.29';
const next = '1.0.0-alpha.30';
const names = ['@govtech-bb/frontend', '@govtech-bb/react'];
const seedIntegrity = `sha512-${createHash('sha512').update('previous release').digest('base64')}`;

async function releaseFixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'govbb-release-test-'));
  const cwd = join(directory, 'checkout');
  const remote = join(directory, 'origin.git');
  const artifacts = join(directory, 'packages');
  mkdirSync(cwd);
  writeFileSync(join(directory, 'gitconfig'), '');
  const registry = {
    status: 200,
    malformed: false,
    loseResponseFor: null,
    puts: [],
    packages: new Map(
      names.map((name) => [
        name,
        {
          name,
          'dist-tags': { alpha: previous },
          versions: {
            [previous]: {
              name,
              version: previous,
              dist: { integrity: seedIntegrity },
            },
          },
        },
      ]),
    ),
  };
  const github = {
    status: 200,
    malformed: false,
    releases: new Map([
      [`v${previous}`, { tag_name: `v${previous}`, draft: false }],
    ]),
  };
  const server = createServer(async (request, response) => {
    const name = decodeURIComponent(request.url.split('?')[0].slice(1));
    response.setHeader('content-type', 'application/json');
    if (name.startsWith('repos/fixture/design-system/releases/tags/')) {
      const release = github.releases.get(name.split('/').at(-1));
      if (github.status !== 200) response.writeHead(github.status).end('{}');
      else if (github.malformed) response.end('not-json');
      else if (release) response.end(JSON.stringify(release));
      else response.writeHead(404).end('{}');
      return;
    }
    if (request.method === 'PUT') {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const version = Object.keys(body.versions)[0];
      registry.puts.push({ name, version });
      const metadata = registry.packages.get(name);
      if (metadata.versions[version]) {
        response
          .writeHead(409)
          .end(JSON.stringify({ error: 'version already exists' }));
        return;
      }
      Object.assign(metadata.versions, body.versions);
      Object.assign(metadata['dist-tags'], body['dist-tags']);
      if (registry.loseResponseFor === name) {
        registry.loseResponseFor = null;
        response.destroy();
        return;
      }
      response.writeHead(201).end(JSON.stringify({ ok: true }));
      return;
    }
    if (name.startsWith('-/package/') && name.endsWith('/dist-tags')) {
      const packageName = name.slice('-/package/'.length, -'/dist-tags'.length);
      response.end(
        JSON.stringify(registry.packages.get(packageName)?.['dist-tags'] || {}),
      );
      return;
    }
    if (registry.status !== 200) {
      response
        .writeHead(registry.status)
        .end(JSON.stringify({ error: 'dummy-token-must-not-be-logged' }));
    } else if (registry.malformed) {
      response.end('not-json');
    } else if (registry.packages.has(name)) {
      response.end(JSON.stringify(registry.packages.get(name)));
    } else {
      response.writeHead(404).end(JSON.stringify({ error: 'not found' }));
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const registryUrl = `http://127.0.0.1:${server.address().port}/`;
  writeFileSync(
    join(directory, 'npmrc'),
    `registry=${registryUrl}\n//127.0.0.1:${server.address().port}/:_authToken=dummy-local-token\n`,
  );
  const env = {
    PATH: process.env.PATH,
    HOME: directory,
    TMPDIR: directory,
    COREPACK_HOME:
      process.env.COREPACK_HOME ||
      join(process.env.HOME, '.cache/node/corepack'),
    GIT_CONFIG_GLOBAL: join(directory, 'gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
    GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: 'fixture/design-system',
    GITHUB_API_URL: registryUrl,
    GH_TOKEN: 'dummy-local-token',
    GH_ENTERPRISE_TOKEN: 'dummy-local-token',
    GH_CONFIG_DIR: join(directory, 'gh'),
    GH_PROMPT_DISABLED: '1',
    RELEASE_VERSION: next,
    REPLACE_UNRELEASED: 'false',
    npm_config_registry: registryUrl,
    npm_config_userconfig: join(directory, 'npmrc'),
    npm_config_cache: join(directory, 'npm-cache'),
    npm_config_provenance: 'false',
    npm_config_update_notifier: 'false',
    npm_config_fetch_retries: '0',
    npm_config_fetch_timeout: '3000',
    // The fixture reuses installed tools, never installs into its node_modules symlink.
    pnpm_config_verify_deps_before_run: 'false',
  };
  const git = (...args) =>
    execFileSync('git', args, {
      cwd,
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  const write = (path, value) => writeFileSync(join(cwd, path), value);
  const commit = (message) => {
    git('add', '.');
    git('commit', '-qm', message);
  };
  execFileSync('git', ['init', '--bare', remote], { env, stdio: 'ignore' });
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Release test');
  git('config', 'user.email', 'release-test@example.invalid');
  git('remote', 'add', 'origin', remote);
  write('.gitignore', 'node_modules/\n');
  write(
    'package.json',
    JSON.stringify({
      name: 'release-fixture',
      private: true,
      packageManager: 'pnpm@11.9.0',
    }),
  );
  write('pnpm-workspace.yaml', 'packages:\n  - packages/*\n');
  for (const name of names) {
    const pkg = name.split('/')[1];
    mkdirSync(join(cwd, 'packages', pkg), { recursive: true });
    write(
      `packages/${pkg}/package.json`,
      `${JSON.stringify(
        {
          name,
          version: previous,
          files: ['index.js'],
          ...(pkg === 'react'
            ? { dependencies: { '@govtech-bb/frontend': 'workspace:^' } }
            : {}),
        },
        null,
        2,
      )}\n`,
    );
    write(`packages/${pkg}/index.js`, 'export const value = 1;\n');
  }
  const workspaceLink = join(cwd, 'packages/react/node_modules/@govtech-bb');
  mkdirSync(workspaceLink, { recursive: true });
  symlinkSync(
    join(cwd, 'packages/frontend'),
    join(workspaceLink, 'frontend'),
    'dir',
  );
  copyFileSync(join(root, 'cliff.toml'), join(cwd, 'cliff.toml'));
  copyFileSync(join(root, '.prettierrc.json'), join(cwd, '.prettierrc.json'));
  symlinkSync(join(root, 'node_modules'), join(cwd, 'node_modules'), 'dir');
  write('CHANGELOG.md', '# Changelog\n');
  commit('chore: seed fixture');
  git('tag', `v${previous}`);
  write('feature.txt', 'new feature\n');
  commit('feat(button): add a feature');
  git('push', '-q', 'origin', 'main', '--tags');
  const cli = (script, ...args) =>
    new Promise((resolve) => {
      execFile(
        process.execPath,
        [join(root, 'ci', script), ...args],
        {
          cwd,
          env,
          encoding: 'utf8',
          timeout: 30000,
          maxBuffer: 4 * 1024 * 1024,
        },
        (error, stdout, stderr) =>
          resolve({ status: error ? 1 : 0, stdout, stderr }),
      );
    });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  });
  const mergeRelease = async () => {
    succeeded(await cli('prepare-release.mjs'));
    commit(`chore(release): v${env.RELEASE_VERSION}`);
    git('push', '-q', 'origin', 'main');
  };
  return {
    cwd,
    artifacts,
    registry,
    github,
    env,
    git,
    write,
    commit,
    cli,
    mergeRelease,
  };
}

function succeeded(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

test('hosted preparation changes only release files and can refresh from main', async (t) => {
  const fixture = await releaseFixture(t);
  const before = fixture.git('rev-parse', 'HEAD');
  succeeded(await fixture.cli('prepare-release.mjs'));
  assert.equal(fixture.git('rev-parse', 'HEAD'), before);
  assert.equal(fixture.git('branch', '--show-current'), 'main');
  assert.deepEqual(fixture.git('diff', '--name-only').split('\n'), [
    'CHANGELOG.md',
    'packages/frontend/package.json',
    'packages/react/package.json',
  ]);
  assert.match(
    readFileSync(join(fixture.cwd, 'CHANGELOG.md'), 'utf8'),
    /Add a feature/,
  );
  assert.equal(fixture.registry.puts.length, 0);
  fixture.git('restore', '.');
  succeeded(await fixture.cli('prepare-release.mjs'));
});

test('release preparation has no local mode', async (t) => {
  const fixture = await releaseFixture(t);
  fixture.env.GITHUB_ACTIONS = 'false';
  const result = await fixture.cli('prepare-release.mjs');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Prepare release workflow/);
  assert.equal(fixture.git('status', '--porcelain'), '');
});

test('registry errors and malformed responses fail closed without changing Git', async (t) => {
  const fixture = await releaseFixture(t);
  for (const status of [401, 403, 503]) {
    fixture.registry.status = status;
    const result = await fixture.cli('prepare-release.mjs');
    assert.equal(result.status, 1);
    assert.doesNotMatch(
      result.stdout + result.stderr,
      /dummy-token-must-not-be-logged|dummy-local-token/,
    );
    assert.equal(fixture.git('status', '--porcelain'), '');
  }
  fixture.registry.status = 200;
  fixture.registry.malformed = true;
  assert.equal((await fixture.cli('prepare-release.mjs')).status, 1);
  assert.equal(fixture.git('status', '--porcelain'), '');
});

test('partial publication cannot be replaced and malformed input cannot bypass the guard', async (t) => {
  const fixture = await releaseFixture(t);
  delete fixture.registry.packages.get(names[1]).versions[previous];
  fixture.env.REPLACE_UNRELEASED = 'true';
  const result = await fixture.cli('prepare-release.mjs');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /partially published/);
  fixture.env.REPLACE_UNRELEASED = 'tru';
  assert.equal((await fixture.cli('prepare-release.mjs')).status, 1);
  assert.equal(fixture.git('branch', '--show-current'), 'main');
  assert.equal(fixture.git('status', '--porcelain'), '');
});

test('a failed changelog command creates no commit, branch or publication', async (t) => {
  const fixture = await releaseFixture(t);
  fixture.write('cliff.toml', '[invalid TOML');
  fixture.commit('test: break changelog configuration');
  fixture.git('push', '-q', 'origin', 'main');
  const before = fixture.git('rev-parse', 'HEAD');
  assert.equal((await fixture.cli('prepare-release.mjs')).status, 1);
  assert.equal(fixture.git('rev-parse', 'HEAD'), before);
  assert.equal(fixture.git('branch', '--list'), '* main');
  assert.equal(fixture.registry.puts.length, 0);
});

test('changes merged after preparation fail the release-note gate', async (t) => {
  const fixture = await releaseFixture(t);
  succeeded(await fixture.cli('prepare-release.mjs'));
  fixture.git('switch', '-c', 'release/next');
  fixture.commit('chore(release): prepare release');
  fixture.git('switch', 'main');
  fixture.write('late.txt', 'late feature\n');
  fixture.commit('feat(input): add a late feature');
  fixture.git(
    'merge',
    '--no-ff',
    'release/next',
    '-m',
    'chore(release): merge release',
  );
  const result = await fixture.cli('release.mjs', 'notes');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /changelog is stale/);
  assert.equal(fixture.registry.puts.length, 0);
});

test('real npm publish resumes after a committed upload loses its response', async (t) => {
  const fixture = await releaseFixture(t);
  await fixture.mergeRelease();
  succeeded(await fixture.cli('release.mjs', 'pack', fixture.artifacts));
  fixture.git('tag', `v${next}`);
  const repeated = join(fixture.artifacts, 'repeated');
  succeeded(await fixture.cli('release.mjs', 'pack', repeated));
  for (const name of names) {
    const filename = `${name.slice(1).replace('/', '-')}-${next}.tgz`;
    assert.deepEqual(
      readFileSync(join(fixture.artifacts, filename)),
      readFileSync(join(repeated, filename)),
    );
  }
  fixture.registry.loseResponseFor = names[0];
  const interrupted = await fixture.cli(
    'release.mjs',
    'publish',
    fixture.artifacts,
  );
  assert.equal(interrupted.status, 1);
  assert.match(interrupted.stderr, /outcome is unconfirmed/);
  assert.ok(fixture.registry.packages.get(names[0]).versions[next]);
  assert.equal(
    fixture.registry.packages.get(names[1]).versions[next],
    undefined,
  );
  succeeded(await fixture.cli('release.mjs', 'publish', fixture.artifacts));
  succeeded(await fixture.cli('release.mjs', 'publish', fixture.artifacts));
  assert.deepEqual(
    fixture.registry.puts,
    names.map((name) => ({ name, version: next })),
  );
  for (const name of names)
    assert.equal(fixture.registry.packages.get(name)['dist-tags'].alpha, next);

  // Both npm packages alone are not completion: a lost GitHub response must
  // be reconciled, then a further run becomes a read-only no-op.
  const missingRelease = await fixture.cli('release.mjs', 'check');
  succeeded(missingRelease);
  assert.equal(JSON.parse(missingRelease.stdout).needed, true);
  fixture.github.releases.set(`v${next}`, {
    tag_name: `v${next}`,
    draft: false,
  });
  const complete = await fixture.cli('release.mjs', 'check');
  succeeded(complete);
  assert.deepEqual(JSON.parse(complete.stdout), { needed: false });
});

test('both tarballs are validated before either package is published', async (t) => {
  const fixture = await releaseFixture(t);
  await fixture.mergeRelease();
  succeeded(await fixture.cli('release.mjs', 'pack', fixture.artifacts));
  fixture.git('tag', `v${next}`);
  rmSync(join(fixture.artifacts, `govtech-bb-react-${next}.tgz`));
  assert.equal(
    (await fixture.cli('release.mjs', 'publish', fixture.artifacts)).status,
    1,
  );
  assert.equal(fixture.registry.puts.length, 0);
});

test('retries reject changed bytes, changed distribution tags and a different source', async (t) => {
  const fixture = await releaseFixture(t);
  await fixture.mergeRelease();
  succeeded(await fixture.cli('release.mjs', 'pack', fixture.artifacts));
  fixture.git('tag', `v${next}`);
  succeeded(await fixture.cli('release.mjs', 'publish', fixture.artifacts));
  const frontend = fixture.registry.packages.get(names[0]);
  frontend['dist-tags'].alpha = previous;
  const channel = await fixture.cli(
    'release.mjs',
    'publish',
    fixture.artifacts,
  );
  assert.equal(channel.status, 1);
  assert.match(channel.stderr, /distribution tag mismatch/);
  frontend['dist-tags'].alpha = next;
  frontend.versions[next].dist.integrity = seedIntegrity;
  const mismatch = await fixture.cli(
    'release.mjs',
    'publish',
    fixture.artifacts,
  );
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /integrity mismatch/);
  fixture.git('tag', '-d', `v${next}`);
  fixture.git('tag', `v${next}`, 'HEAD^');
  const wrongTag = await fixture.cli(
    'release.mjs',
    'publish',
    fixture.artifacts,
  );
  assert.equal(wrongTag.status, 1);
  assert.match(wrongTag.stderr, /different commit/);
  assert.equal(fixture.registry.puts.length, 2);
});

test('release lookup rejects GitHub errors, malformed metadata and drafts', async (t) => {
  const fixture = await releaseFixture(t);
  for (const status of [401, 403, 503]) {
    fixture.github.status = status;
    const result = await fixture.cli('release.mjs', 'check');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /absence is unconfirmed/);
  }
  fixture.github.status = 200;
  fixture.github.malformed = true;
  assert.equal((await fixture.cli('release.mjs', 'check')).status, 1);
  fixture.github.malformed = false;
  fixture.github.releases.get(`v${previous}`).draft = true;
  const draft = await fixture.cli('release.mjs', 'check');
  assert.equal(draft.status, 1);
  assert.match(draft.stderr, /existing draft/);
  assert.equal(fixture.registry.puts.length, 0);
});

test('a released revert is a no-op but a React-only bump fails lockstep', async (t) => {
  const fixture = await releaseFixture(t);
  fixture.git('tag', `v${next}`);
  const released = await fixture.cli('release.mjs', 'check');
  succeeded(released);
  assert.deepEqual(JSON.parse(released.stdout), { needed: false });
  const manifest = JSON.parse(
    readFileSync(join(fixture.cwd, 'packages/react/package.json')),
  );
  manifest.version = next;
  fixture.write(
    'packages/react/package.json',
    JSON.stringify(manifest, null, 2),
  );
  fixture.commit('chore(release): bump only react');
  const mismatch = await fixture.cli('release.mjs', 'check');
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /versions must match/);
});

test('the source is the commit aligning both versions, not the first bump or a later fix', async (t) => {
  const fixture = await releaseFixture(t);
  for (const pkg of ['frontend', 'react']) {
    const path = `packages/${pkg}/package.json`;
    const manifest = JSON.parse(readFileSync(join(fixture.cwd, path)));
    manifest.version = next;
    fixture.write(path, JSON.stringify(manifest, null, 2));
    fixture.commit(`chore(release): bump ${pkg}`);
  }
  const aligned = fixture.git('rev-parse', 'HEAD');
  fixture.write('fix.txt', 'a later source fix\n');
  fixture.commit('fix(button): fix a failing test');
  const result = await fixture.cli('release.mjs', 'check');
  succeeded(result);
  assert.equal(JSON.parse(result.stdout).sha, aligned);
});

test('an untagged, wholly unpublished failure can be replaced only explicitly', async (t) => {
  const fixture = await releaseFixture(t);
  await fixture.mergeRelease();
  fixture.env.RELEASE_VERSION = '1.0.0-alpha.31';
  assert.equal((await fixture.cli('prepare-release.mjs')).status, 1);
  fixture.env.REPLACE_UNRELEASED = 'true';
  succeeded(await fixture.cli('prepare-release.mjs'));
  assert.equal(
    JSON.parse(
      readFileSync(join(fixture.cwd, 'packages/frontend/package.json')),
    ).version,
    '1.0.0-alpha.31',
  );
  assert.equal(fixture.registry.puts.length, 0);
  fixture.git('restore', '.');
  fixture.git('tag', `v${next}`);
  const reserved = await fixture.cli('prepare-release.mjs');
  assert.equal(reserved.status, 1);
  assert.match(reserved.stderr, /tagged or partially published/);
});
