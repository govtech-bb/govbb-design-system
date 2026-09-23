import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { publishedSkills } from '../lib/skills';
import { getSortedDesignLog } from '../data/design-log';
import frontend from '../../../../packages/frontend/package.json';
import react from '../../../../packages/react/package.json';

export const GET: APIRoute = async ({ site }) => {
  if (!site)
    throw new Error('The documentation site origin must be configured.');
  const link = (title: string, path: string, description: string) =>
    `- [${title}](${new URL(path, site)}): ${description.replace(/\s+/g, ' ').trim()}`;
  const sections = await Promise.all(
    (
      [
        ['Getting started', 'docs', 'documentation'],
        ['Styles', 'styles', 'styles'],
        ['Components', 'components', 'components'],
        ['Patterns', 'patterns', 'patterns'],
        ['Templates', 'templates', 'templates'],
      ] as const
    ).map(async ([title, collection, path]) => {
      const entries = await getCollection(collection);
      entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
      return `## ${title}\n\n${entries.map((entry) => link(entry.data.title, `/${path}/${entry.id}.md`, entry.data.description)).join('\n')}`;
    }),
  );
  const [skills, posts] = await Promise.all([
    publishedSkills(),
    getSortedDesignLog(),
  ]);
  sections.push(
    `## AI skills\n\n${skills.map((entry) => link(entry.data.metadata.title, `/ai-skills/${entry.id}.md`, entry.data.description)).join('\n')}`,
    `## Design decisions and research\n\n${posts.map((entry) => link(entry.data.title, `/design-log/${entry.id}.md`, `${entry.data.date.toISOString().slice(0, 10)}; ${entry.data.kind}. ${entry.data.summary ?? ''}`)).join('\n')}`,
  );
  return new Response(
    [
      '# GovBB Design System',
      '> Components, styles, patterns and guidance for building accessible Barbados government services.',
      `Documentation build packages: \`${frontend.name}@${frontend.version}\` and \`${react.name}@${react.version}\`. Check the consumer project's installed versions before using an API, class or token; this site is not versioned per installation.`,
      'For HTML or server-rendered services, use `@govtech-bb/frontend` and initialize progressive enhancement after the markup is available. For React services, also use `@govtech-bb/react`; its components own their behavior, so do not run `initAll()` over them. Preserve the service’s chosen framework and supported Tailwind integration.',
      'Fetch the relevant Markdown links below as needed. Component pages include HTML and, where available, React examples. Token tables contain the declared and resolved values used by this documentation build. Design-log dates and kinds distinguish decisions, research and working notes.',
      'Install skills and their supporting references and scripts from the consumer project directory using `npx skills add govtech-bb/govbb-design-system`. List available skills with `npx skills add govtech-bb/govbb-design-system --list`, or select one with `npx skills add govtech-bb/govbb-design-system --skill design-system-compliance`. Skill Markdown pages preview the entrypoint; they do not install the supporting files.',
      ...sections,
    ].join('\n\n') + '\n',
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
};
