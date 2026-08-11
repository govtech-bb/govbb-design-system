// What the site is allowed to publish from the repository's `skills/`
// directory, and the links shown on a skill's page.
//
// Every ai-skills route goes through publishedSkills(). That is the point: a
// route that called getCollection('skills') directly would publish whatever it
// found, and the one thing this filter exists to prevent is a skill reaching the
// public site because a new page forgot to exclude it.

import { getCollection, type CollectionEntry } from 'astro:content';

export type SkillEntry = CollectionEntry<'skills'>;

const GITHUB_SKILLS_BASE =
  'https://github.com/govtech-bb/govbb-design-system/blob/main/skills';

/**
 * Skills this site publishes, alphabetical by title.
 *
 * Two exclusions, deliberately redundant. The primary control is not here at
 * all: the design team's component-authoring skill lives in a separate private
 * repository (see docs/decisions), so it is absent from this collection rather
 * than filtered out of it. `audience` and `internal` catch the case where a
 * restricted skill is vendored into this repo later — cheap to keep, and the
 * alternative is discovering the gap after publication.
 */
export async function publishedSkills(): Promise<SkillEntry[]> {
  const entries = await getCollection(
    'skills',
    ({ data }) =>
      data.metadata.audience === 'public' && !data.metadata.internal,
  );
  return entries.sort((a, b) =>
    a.data.metadata.title.localeCompare(b.data.metadata.title),
  );
}

/** Where a skill's source lives, and its raw-markdown twin on this site. */
export function skillSource(id: string) {
  return {
    sourceUrl: `${GITHUB_SKILLS_BASE}/${id}/SKILL.md`,
    markdownUrl: `/ai-skills/${id}.md`,
  };
}

/**
 * The install command for a skill.
 *
 * Two routes exist and they serve different people: GovTech installs the whole
 * plugin from the team marketplace, while anyone outside it takes a single skill
 * straight from this repository. The marketplace route is not per-skill, so it
 * belongs on the index page rather than here.
 */
export function skillsCliCommand(id: string): string {
  return `npx skills add govtech-bb/govbb-design-system -s ${id}`;
}
