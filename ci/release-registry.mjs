import { execFile } from 'node:child_process';

/** The two packages form one release; neither alone establishes completion. */
export const RELEASE_PACKAGES = Object.freeze([
  '@govtech-bb/frontend',
  '@govtech-bb/react',
]);

class ReleaseRegistryError extends Error {
  _tag = 'ReleaseRegistryError';

  /** @param {string} operation @param {string} code */
  constructor(operation, code) {
    super(
      `Release registry ${operation} failed (${code}). Reconcile npm state before retrying.`,
    );
    this.operation = operation;
    this.code = code;
  }
}

/**
 * Read through npm's configured registry/authentication. Only E404 means
 * absent; authentication, transport and malformed responses remain failures.
 * @param {string} name
 * @param {string} version
 * @returns {Promise<{ok: true, value: {version: string, integrity: string} | null} | {ok: false, error: ReleaseRegistryError}>}
 */
export async function readRegistryVersion(name, version) {
  const args = [
    'view',
    `${name}@${version}`,
    'version',
    'dist.integrity',
    '--json',
    '--fetch-retries=0',
    '--fetch-timeout=15000',
  ];
  return new Promise((resolve) => {
    execFile('npm', args, { encoding: 'utf8' }, (error, stdout) => {
      /** @type {unknown} */
      let response;
      try {
        response = JSON.parse(stdout);
      } catch {
        resolve({
          ok: false,
          error: new ReleaseRegistryError('lookup', 'invalid-response'),
        });
        return;
      }
      if (
        typeof response !== 'object' ||
        response === null ||
        Array.isArray(response)
      ) {
        resolve({
          ok: false,
          error: new ReleaseRegistryError('lookup', 'invalid-response'),
        });
        return;
      }
      if (error) {
        const failure = 'error' in response ? response.error : undefined;
        if (
          typeof failure === 'object' &&
          failure !== null &&
          'code' in failure &&
          failure.code === 'E404'
        ) {
          resolve({ ok: true, value: null });
        } else {
          // npm's free-form error text can include registry URLs or credentials.
          resolve({
            ok: false,
            error: new ReleaseRegistryError('lookup', 'registry-unavailable'),
          });
        }
        return;
      }
      const identity = 'version' in response ? response.version : undefined;
      const integrity =
        'dist.integrity' in response ? response['dist.integrity'] : undefined;
      if (
        identity !== version ||
        typeof integrity !== 'string' ||
        !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity)
      ) {
        resolve({
          ok: false,
          error: new ReleaseRegistryError('lookup', 'invalid-metadata'),
        });
        return;
      }
      resolve({
        ok: true,
        value: { version, integrity },
      });
    });
  });
}
