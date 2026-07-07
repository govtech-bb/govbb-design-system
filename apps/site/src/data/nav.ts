import { getCollection } from 'astro:content';
import type { SidebarGroup } from '../components/Sidebar.astro';
import type { Section } from '../types';

// Primary (top) navigation — single source of truth for the header and sitemap.
export interface PrimaryNavItem {
  key: Section;
  label: string;
  href: string;
}
export const primaryNav: PrimaryNavItem[] = [
  { key: 'styles', label: 'Styles', href: '/styles/' },
  { key: 'components', label: 'Components', href: '/components/' },
  { key: 'documentation', label: 'Documentation', href: '/documentation/' },
  { key: 'ai-skills', label: 'AI skills', href: '/ai-skills/' },
  { key: 'changelog', label: 'Changelog', href: '/changelog/' },
];

// Display order of the component groups (the values of the `group` frontmatter
// field in src/content/components/).
const GROUP_ORDER = [
  'Actions',
  'Form elements',
  'Navigation',
  'Content',
  'Feedback',
] as const;

// Left-sidebar navigation for the Components section, derived from the
// components content collection — add an MDX file and it appears here.
export async function getComponentsSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('components');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Components',
      links: [{ label: 'Overview', href: '/components/' }],
    },
    ...GROUP_ORDER.flatMap((heading) => {
      const links = entries
        .filter((e) => e.data.group === heading)
        .map((e) => ({ label: e.data.title, href: `/components/${e.id}/` }));
      return links.length > 0 ? [{ heading, links }] : [];
    }),
  ];
}

// Left-sidebar navigation for the Styles section, derived from the styles
// content collection.
export async function getStylesSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('styles');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Styles',
      links: [
        { label: 'Overview', href: '/styles/' },
        ...entries.map((e) => ({
          label: e.data.title,
          href: `/styles/${e.id}/`,
        })),
      ],
    },
  ];
}

// Left-sidebar navigation for the Documentation section, derived from the
// docs content collection.
export async function getDocumentationSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('docs');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Documentation',
      links: [
        { label: 'Overview', href: '/documentation/' },
        ...entries.map((e) => ({
          label: e.data.title,
          href: `/documentation/${e.id}/`,
        })),
      ],
    },
  ];
}
