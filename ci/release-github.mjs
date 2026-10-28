import { execFileSync } from 'node:child_process';

class ReleaseGithubError extends Error {
  _tag = 'ReleaseGithubError';
}

/**
 * Read GitHub release completion through gh's authentication. Only HTTP 404
 * means missing; a draft never establishes completion.
 * @param {string} tag
 * @param {{repository: string | undefined, apiUrl: string}} config
 * @returns {{ok: true, value: 'missing' | 'draft' | 'published'} | {ok: false, error: ReleaseGithubError}}
 */
export function readGithubRelease(tag, config) {
  if (!config.repository || !/^[\w.-]+\/[\w.-]+$/.test(config.repository)) {
    return {
      ok: false,
      error: new ReleaseGithubError(
        'GitHub release lookup requires a valid repository.',
      ),
    };
  }
  let endpoint;
  try {
    endpoint = new URL(
      `${config.apiUrl.replace(/\/$/, '')}/repos/${config.repository}/releases/tags/${tag}`,
    );
    if (!['https:', 'http:'].includes(endpoint.protocol)) throw new TypeError();
  } catch {
    return {
      ok: false,
      error: new ReleaseGithubError(
        'GitHub release lookup requires a valid API URL.',
      ),
    };
  }
  let response;
  try {
    response = execFileSync('gh', ['api', '--include', endpoint.href], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    response =
      typeof error === 'object' && error !== null && 'stdout' in error
        ? error.stdout
        : undefined;
  }
  if (typeof response === 'string') {
    const status = /^HTTP\/\S+ (\d+)/.exec(response)?.[1];
    if (status === '404') return { ok: true, value: 'missing' };
    if (status === '200') {
      const body = response.split(/\r?\n\r?\n/, 2)[1];
      try {
        /** @type {unknown} */
        const metadata = JSON.parse(body ?? '');
        if (
          typeof metadata === 'object' &&
          metadata !== null &&
          'tag_name' in metadata &&
          metadata.tag_name === tag &&
          'draft' in metadata &&
          typeof metadata.draft === 'boolean'
        ) {
          return { ok: true, value: metadata.draft ? 'draft' : 'published' };
        }
      } catch {
        // An invalid response cannot establish either absence or completion.
      }
    }
  }
  return {
    ok: false,
    error: new ReleaseGithubError(
      'GitHub release lookup failed; absence is unconfirmed. Retry after resolving the API error.',
    ),
  };
}
