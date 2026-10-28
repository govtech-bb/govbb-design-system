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
      } else response.writeHead(201).end(JSON.stringify({ ok: true }));
      return;
    }
    if (name.startsWith('-/package/') && name.endsWith('/dist-tags')) {
      const packageName = name.slice('-/package/'.length, -'/dist-tags'.length);
      response.end(
        JSON.stringify(registry.packages.get(packageName)['dist-tags']),
      );
      return;
    }
    if (registry.status !== 200)
      response
        .writeHead(registry.status)
        .end(JSON.stringify({ error: 'dummy-token-must-not-be-logged' }));
    else if (registry.malformed) response.end('not-json');
    else if (registry.packages.has(name))
      response.end(JSON.stringify(registry.packages.get(name)));
    else response.writeHead(404).end('{}');
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
    // The fixture reuses installed tools without installing into their symlink.
    pnpm_config_verify_deps_before_run: 'false',
  };
  const git = (...args) =>
    execFileSync('git', args, {
      cwd,
      env,
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  const write = (path, value) => writeFileSync(join(cwd, path), value);
  const commit = (message) => {
    git('add', '.');
    git('commit', '-qm', message);
    git('update-ref', 'refs/remotes/origin/main', 'main');
  };
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Release test');
  git('config', 'user.email', 'release-test@example.invalid');
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
  const run = (program, args) =>
    new Promise((resolve) => {
      execFile(
        program,
        args,
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
  const cli = (...args) =>
    run(process.execPath, [join(root, 'ci/release.mjs'), ...args]);
  const pack = (destination = artifacts) => {
    mkdirSync(destination, { recursive: true });
    return run('pnpm', [
      '--filter',
      './packages/*',
      'pack',
      '--pack-destination',
      destination,
    ]);
  };
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  });
  const mergeRelease = async () => {
    succeeded(await cli('prepare'));
    commit(`chore(release): v${env.RELEASE_VERSION}`);
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
    pack,
    mergeRelease,
  };
}

function succeeded(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

test('hosted preparation validates versions, changes only release files and can refresh', async (t) => {
  const f = await releaseFixture(t);
  const before = f.git('rev-parse', 'HEAD');
  for (const version of [
    'v1.0.0',
    '2.0.0',
    '1.01.0',
    '1.0.0-alpha.030',
    '1.0.0+build.1',
    '1.0.0\n',
    previous,
    '1.0.0-alpha.28',
  ]) {
    f.env.RELEASE_VERSION = version;
    assert.equal((await f.cli('prepare')).status, 1, version);
    assert.equal(f.git('status', '--porcelain'), '');
  }
  f.env.RELEASE_VERSION = next;
  succeeded(await f.cli('prepare'));
  assert.deepEqual(f.git('diff', '--name-only').split('\n'), [
    'CHANGELOG.md',
    'packages/frontend/package.json',
    'packages/react/package.json',
  ]);
  assert.match(
    readFileSync(join(f.cwd, 'CHANGELOG.md'), 'utf8'),
    /Add a feature/,
  );
  assert.equal(f.git('rev-parse', 'HEAD'), before);
  f.git('restore', '.');
  succeeded(await f.cli('prepare'));
  f.git('restore', '.');
  f.env.GITHUB_ACTIONS = 'false';
  assert.equal((await f.cli('prepare')).status, 1);
  assert.equal(f.git('branch', '--list'), '* main');
  assert.equal(f.registry.puts.length, 0);
});

test('registry and GitHub failures never mean absence or mutate the release', async (t) => {
  const f = await releaseFixture(t);
  for (const provider of [f.registry, f.github]) {
    for (const status of [401, 403, 503]) {
      provider.status = status;
      const result = await f.cli('prepare');
      assert.equal(result.status, 1);
      assert.doesNotMatch(
        result.stdout + result.stderr,
        /dummy-local-token|dummy-token-must-not-be-logged/,
      );
    }
    provider.status = 200;
    provider.malformed = true;
    assert.equal((await f.cli('prepare')).status, 1);
    provider.malformed = false;
  }
  f.github.releases.get(`v${previous}`).draft = true;
  assert.match((await f.cli('check')).stderr, /existing draft/);
  f.github.releases.get(`v${previous}`).draft = false;
  f.write('cliff.toml', '[invalid TOML');
  f.commit('test: break changelog configuration');
  const before = f.git('rev-parse', 'HEAD');
  assert.equal((await f.cli('prepare')).status, 1);
  assert.equal(f.git('rev-parse', 'HEAD'), before);
  assert.equal(f.git('branch', '--list'), '* main');
  assert.equal(f.registry.puts.length, 0);
});

test('changes merged after preparation fail the release-note gate', async (t) => {
  const f = await releaseFixture(t);
  succeeded(await f.cli('prepare'));
  f.git('switch', '-c', 'release/next');
  f.commit('chore(release): prepare release');
  f.git('switch', 'main');
  f.write('late.txt', 'late feature\n');
  f.commit('feat(input): add a late feature');
  f.git(
    'merge',
    '--no-ff',
    'release/next',
    '-m',
    'chore(release): merge release',
  );
  for (const operation of ['notes', 'check']) {
    const result = await f.cli(operation);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /changelog is stale/);
  }
  assert.equal(f.registry.puts.length, 0);
});

test('real npm publish resumes after a committed upload loses its response', async (t) => {
  const f = await releaseFixture(t);
  await f.mergeRelease();
  succeeded(await f.pack());
  succeeded(await f.cli('verify', f.artifacts));
  f.git('tag', `v${next}`);
  const repeated = join(f.artifacts, 'repeated');
  succeeded(await f.pack(repeated));
  for (const name of names) {
    const filename = `${name.slice(1).replace('/', '-')}-${next}.tgz`;
    assert.deepEqual(
      readFileSync(join(f.artifacts, filename)),
      readFileSync(join(repeated, filename)),
    );
  }
  f.registry.loseResponseFor = names[0];
  const interrupted = await f.cli('publish', f.artifacts);
  assert.equal(interrupted.status, 1);
  assert.match(interrupted.stderr, /outcome is unconfirmed/);
  assert.ok(f.registry.packages.get(names[0]).versions[next]);
  assert.equal(f.registry.packages.get(names[1]).versions[next], undefined);
  succeeded(await f.cli('publish', f.artifacts));
  succeeded(await f.cli('publish', f.artifacts));
  assert.deepEqual(
    f.registry.puts,
    names.map((name) => ({ name, version: next })),
  );
  for (const name of names)
    assert.equal(f.registry.packages.get(name)['dist-tags'].alpha, next);
  const missingRelease = await f.cli('check');
  succeeded(missingRelease);
  assert.equal(JSON.parse(missingRelease.stdout).needed, true);
  f.github.releases.set(`v${next}`, { tag_name: `v${next}`, draft: false });
  const complete = await f.cli('check');
  succeeded(complete);
  assert.deepEqual(JSON.parse(complete.stdout), { needed: false });
});

test('preflight checks both tarballs and retries reject changed bytes, channels or tags', async (t) => {
  const f = await releaseFixture(t);
  await f.mergeRelease();
  succeeded(await f.pack());
  rmSync(join(f.artifacts, `govtech-bb-react-${next}.tgz`));
  assert.equal((await f.cli('verify', f.artifacts)).status, 1);
  assert.equal(f.registry.puts.length, 0);
  assert.equal(f.git('tag', '--list', `v${next}`), '');
  succeeded(await f.pack());
  f.git('tag', `v${next}`);
  succeeded(await f.cli('publish', f.artifacts));
  const frontend = f.registry.packages.get(names[0]);
  frontend['dist-tags'].alpha = previous;
  assert.match(
    (await f.cli('publish', f.artifacts)).stderr,
    /distribution tag mismatch/,
  );
  frontend['dist-tags'].alpha = next;
  frontend.versions[next].dist.integrity = seedIntegrity;
  assert.match(
    (await f.cli('publish', f.artifacts)).stderr,
    /integrity mismatch/,
  );
  f.git('tag', '-d', `v${next}`);
  f.git('tag', `v${next}`, 'HEAD^');
  assert.match(
    (await f.cli('publish', f.artifacts)).stderr,
    /different commit/,
  );
  assert.equal(f.registry.puts.length, 2);
});

test('completed reverts are no-ops but React-only version changes are rejected', async (t) => {
  const f = await releaseFixture(t);
  f.git('tag', `v${next}`);
  const released = await f.cli('check');
  succeeded(released);
  assert.deepEqual(JSON.parse(released.stdout), { needed: false });
  const manifest = JSON.parse(
    readFileSync(join(f.cwd, 'packages/react/package.json')),
  );
  manifest.version = next;
  f.write('packages/react/package.json', JSON.stringify(manifest, null, 2));
  f.commit('chore(release): bump only react');
  const mismatch = await f.cli('check');
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /versions must match/);
});

test('both manifests determine the release commit and later commits must use the original run', async (t) => {
  const f = await releaseFixture(t);
  succeeded(await f.cli('prepare'));
  const path = 'packages/react/package.json';
  const react = JSON.parse(readFileSync(join(f.cwd, path)));
  react.version = previous;
  f.write(path, `${JSON.stringify(react, null, 2)}\n`);
  f.commit('chore(release): bump frontend');
  react.version = next;
  f.write(path, `${JSON.stringify(react, null, 2)}\n`);
  f.commit('chore(release): bump react');
  succeeded(await f.cli('check'));
  f.write('fix.txt', 'a later source fix\n');
  f.commit('fix(button): fix a failing test');
  const later = await f.cli('check');
  assert.equal(later.status, 1);
  assert.match(later.stderr, /Re-run the original Release run/);
  assert.equal(f.registry.puts.length, 0);
});

test('replacement is explicit and forbidden after tagging or partial publication', async (t) => {
  const f = await releaseFixture(t);
  await f.mergeRelease();
  f.env.RELEASE_VERSION = '1.0.0';
  assert.equal((await f.cli('prepare')).status, 1);
  f.env.REPLACE_UNRELEASED = 'tru';
  assert.equal((await f.cli('prepare')).status, 1);
  f.env.REPLACE_UNRELEASED = 'true';
  succeeded(await f.cli('prepare'));
  f.commit('chore(release): replace unpublished prerelease');
  const stable = await f.cli('check');
  succeeded(stable);
  assert.equal(JSON.parse(stable.stdout).npm_tag, 'latest');
  f.env.RELEASE_VERSION = '1.0.1';
  f.git('tag', 'v1.0.0');
  assert.match(
    (await f.cli('prepare')).stderr,
    /tagged or partially published/,
  );
  f.git('tag', '-d', 'v1.0.0');
  f.registry.packages.get(names[0]).versions['1.0.0'] = {
    name: names[0],
    version: '1.0.0',
    dist: { integrity: seedIntegrity },
  };
  assert.match(
    (await f.cli('prepare')).stderr,
    /tagged or partially published/,
  );
  assert.equal(f.registry.puts.length, 0);
});
