import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Changelog / decision log: dated posts recording important design decisions.
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    summary: z.string().optional(),
  }),
});

// Component guidance pages. One markdown file per component; the frontmatter
// drives the sidebar (group + title) and the page header, and every ```html
// code fence renders as a live example (see components/[slug].astro).
const components = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/components' }),
  schema: z.object({
    title: z.string(),
    /** Meta description; also the blurb on the components overview page. */
    description: z.string(),
    /** One-line subtitle shown under the page title. */
    lede: z.string(),
    group: z.enum(['Actions', 'Form elements', 'Content', 'Feedback']),
  }),
});

// Long-form documentation pages (standards, guidelines, how-tos).
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lede: z.string(),
  }),
});

export const collections = { changelog, components, docs };
