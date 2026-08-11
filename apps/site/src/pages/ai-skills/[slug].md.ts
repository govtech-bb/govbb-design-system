import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { publishedSkills, type SkillEntry } from '../../lib/skills';

// Raw-markdown twin of every skill page: /ai-skills/<slug>.md
//
// The other sections' twins reconstruct a document from the entry's title and
// body, because that is what a reader wants pasted into an AI. A skill is
// different: the frontmatter is not page metadata, it is the part the skills CLI
// and Claude Code actually read. Serving the file verbatim — frontmatter and all
// — means this URL is a usable SKILL.md rather than a description of one, and it
// cannot disagree with the file the agent loads.
export async function getStaticPaths() {
  const entries = await publishedSkills();
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: SkillEntry }> = async ({ props }) => {
  const { entry } = props;

  // filePath is set by the glob loader and is what makes a verbatim copy
  // possible. If a future loader change drops it, fall back to the body rather
  // than serving nothing — degraded but still useful.
  const source = entry.filePath
    ? await readFile(entry.filePath, 'utf8')
    : `# ${entry.data.metadata.title}\n\n${entry.data.description}\n\n${entry.body ?? ''}`;

  return new Response(source, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
