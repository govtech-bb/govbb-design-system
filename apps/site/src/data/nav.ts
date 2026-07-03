import type { SidebarGroup } from '../components/Sidebar.astro';
import type { Section } from '../types';

// Primary (top) navigation — single source of truth for the header and sitemap.
export interface PrimaryNavItem {
  key: Section;
  label: string;
  href: string;
}
export const primaryNav: PrimaryNavItem[] = [
  { key: 'components', label: 'Components', href: '/components/' },
  { key: 'documentation', label: 'Documentation', href: '/documentation/' },
  { key: 'ai-skills', label: 'AI skills', href: '/ai-skills/' },
  { key: 'changelog', label: 'Changelog', href: '/changelog/' },
];

// Left-sidebar navigation for the Components section. Grouped the way GOV.UK
// groups its component index; extend as real components land.
export const componentsSidebar: SidebarGroup[] = [
  {
    heading: 'Components',
    links: [{ label: 'Overview', href: '/components/' }],
  },
  {
    heading: 'Actions',
    links: [{ label: 'Button', href: '/components/button/' }],
  },
  {
    heading: 'Form elements',
    links: [{ label: 'Radio', href: '/components/radio/' }],
  },
];

// Left-sidebar navigation for the Documentation section.
export const documentationSidebar: SidebarGroup[] = [
  {
    heading: 'Documentation',
    links: [
      { label: 'Overview', href: '/documentation/' },
      {
        label: 'Using the design system',
        href: '/documentation/using-the-design-system/',
      },
    ],
  },
];
