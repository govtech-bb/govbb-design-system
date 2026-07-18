import { getCollection } from 'astro:content';
import type { SidebarGroup } from '../components/Sidebar.astro';
import type { Section } from '../types';

// Primary (top) navigation — single source of truth for the header and sitemap.
export interface PrimaryNavItem {
  key: Section;
  label: string;
  href: string;
  description: string;
}
export const primaryNav: PrimaryNavItem[] = [
  {
    key: 'documentation',
    label: 'Get started',
    href: '/documentation/',
    description:
      'Adopt the design system and understand the standards every service follows.',
  },
  {
    key: 'styles',
    label: 'Styles',
    href: '/styles/',
    description:
      'Use the shared visual foundations, tokens, typography and spacing.',
  },
  {
    key: 'components',
    label: 'Components',
    href: '/components/',
    description:
      'Build interfaces from reusable parts with recorded maturity and review status.',
  },
  {
    key: 'patterns',
    label: 'Patterns',
    href: '/patterns/',
    description: 'Solve common government-service tasks in proven ways.',
  },
  {
    key: 'templates',
    label: 'Templates',
    href: '/templates/',
    description: 'Start from complete pages assembled from the system.',
  },
  {
    key: 'design-log',
    label: 'Design log',
    href: '/design-log/',
    description:
      'Read the research, decisions and working notes behind the system.',
  },
];

// Sections kept out of the header (GOV.UK-style: styles / components only)
// but still linked from the footer and sitemap.
export const secondaryNav: PrimaryNavItem[] = [
  {
    key: 'support',
    label: 'Support',
    href: '/support/',
    description:
      'Get help, report an issue and understand how the system is governed.',
  },
  {
    key: 'ai-skills',
    label: 'AI skills',
    href: '/ai-skills/',
    description:
      'Apply the same design, accessibility and privacy standards to AI-assisted work.',
  },
];

// Display order of the component groups (the values of the `group` frontmatter
// field in src/content/components/).
export const GROUP_ORDER = [
  'Actions',
  'Form elements',
  'Navigation',
  'Page furniture',
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
// Styles nest one level: an entry at `typography/lists.md` is a child of
// `typography.md`, and each parent with children gets its own sidebar group
// (Overview + children) under the main Styles group.
export async function getStylesSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('styles');
  entries.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
  const topLevel = entries.filter((e) => !e.id.includes('/'));
  const hasChildren = (id: string) =>
    entries.some((e) => e.id.startsWith(`${id}/`));
  return [
    {
      heading: 'Styles',
      links: [
        { label: 'Overview', href: '/styles/' },
        // Parents with children are represented by their own group below.
        ...topLevel
          .filter((e) => !hasChildren(e.id))
          .map((e) => ({
            label: e.data.title,
            href: `/styles/${e.id}/`,
          })),
      ],
    },
    ...topLevel.flatMap((parent) => {
      const children = entries.filter((e) => e.id.startsWith(`${parent.id}/`));
      return children.length > 0
        ? [
            {
              heading: parent.data.title,
              links: [
                { label: 'Overview', href: `/styles/${parent.id}/` },
                ...children.map((e) => ({
                  label: e.data.title,
                  href: `/styles/${e.id}/`,
                })),
              ],
            },
          ]
        : [];
    }),
  ];
}

// Display order of the pattern groups (the values of the `group` frontmatter
// field in src/content/patterns/).
const PATTERN_GROUP_ORDER = [
  'Build forms',
  'Ask users for',
  'Help users to',
] as const;

// Left-sidebar navigation for the Patterns section, derived from the patterns
// content collection — grouped like the components sidebar.
export async function getPatternsSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('patterns');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Patterns',
      links: [{ label: 'Overview', href: '/patterns/' }],
    },
    ...PATTERN_GROUP_ORDER.flatMap((heading) => {
      const links = entries
        .filter((e) => e.data.group === heading)
        .map((e) => ({ label: e.data.title, href: `/patterns/${e.id}/` }));
      return links.length > 0 ? [{ heading, links }] : [];
    }),
  ];
}

// Display order of the template groups (the values of the `group` frontmatter
// field in src/content/templates/).
const TEMPLATE_GROUP_ORDER = [
  'Service pages',
  'Authentication',
  'Forms',
  'Error pages',
] as const;

// Left-sidebar navigation for the Templates section, derived from the templates
// content collection — grouped like the components and patterns sidebars.
export async function getTemplatesSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('templates');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Templates',
      links: [{ label: 'Overview', href: '/templates/' }],
    },
    ...TEMPLATE_GROUP_ORDER.flatMap((heading) => {
      const links = entries
        .filter((e) => e.data.group === heading)
        .map((e) => ({ label: e.data.title, href: `/templates/${e.id}/` }));
      return links.length > 0 ? [{ heading, links }] : [];
    }),
  ];
}

// Left-sidebar navigation for the Design log, derived from the design log
// collection — newest first, grouped by year.
export async function getDesignLogSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('designLog');
  entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const byYear = new Map<number, { label: string; href: string }[]>();
  for (const e of entries) {
    const year = e.data.date.getUTCFullYear();
    byYear.set(year, [
      ...(byYear.get(year) ?? []),
      { label: e.data.title, href: `/design-log/${e.id}/` },
    ]);
  }
  return [
    {
      heading: 'Design log',
      links: [{ label: 'Overview', href: '/design-log/' }],
    },
    ...[...byYear.entries()].map(([year, links]) => ({
      heading: String(year),
      links,
    })),
  ];
}

// Left-sidebar navigation for the Documentation section, derived from the
// docs content collection.
export async function getDocumentationSidebar(): Promise<SidebarGroup[]> {
  const entries = await getCollection('docs');
  entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return [
    {
      heading: 'Get started',
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
