import semver from 'semver';

/** A canonical npm version, constructed only by parseReleaseVersion. */
class ReleaseVersion {
  /** @param {string} version */
  constructor(version) {
    this.version = version;
    this.tag = `v${version}`;
    this.npmTag = semver.prerelease(version) ? 'alpha' : 'latest';
    Object.freeze(this);
  }
}

class InvalidReleaseVersion extends Error {
  _tag = 'InvalidReleaseVersion';
}

/**
 * Parse a canonical 1.x npm version; build metadata is refused because npm
 * removes it from package identity. An existing own tag permits recovery.
 * @param {unknown} input
 * @param {readonly string[]} tags
 * @returns {{ok: true, value: ReleaseVersion} | {ok: false, error: InvalidReleaseVersion}}
 */
export function parseReleaseVersion(input, tags) {
  if (
    typeof input !== 'string' ||
    semver.valid(input) !== input ||
    semver.major(input) !== 1
  ) {
    return {
      ok: false,
      error: new InvalidReleaseVersion(
        'Release version must be canonical 1.x semver, without a leading v or build metadata.',
      ),
    };
  }
  const newer = tags.find(
    (tag) =>
      tag.startsWith('v') &&
      tag !== `v${input}` &&
      semver.valid(tag.slice(1)) &&
      semver.gte(tag.slice(1), input),
  );
  if (newer) {
    return {
      ok: false,
      error: new InvalidReleaseVersion(
        `Release version must be newer than ${newer}.`,
      ),
    };
  }
  return { ok: true, value: new ReleaseVersion(input) };
}
