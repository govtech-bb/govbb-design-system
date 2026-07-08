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
    group: z.enum([
      'Actions',
      'Form elements',
      'Navigation',
      'Page furniture',
      'Content',
      'Feedback',
    ]),
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

// Foundations: layout, colour, typography, spacing — the visual language
// underneath the components. Pages whose ```html fences are self-contained
// snippets set `examples: true` to render them as live previews; pages whose
// fences are page-level scaffolds (like layout) leave them as plain code.
const styles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/styles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lede: z.string(),
    examples: z.boolean().default(false),
  }),
});

// Patterns: task-level guidance composing several components, such as taking
// a payment. Same live-example treatment as component pages.
const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lede: z.string(),
  }),
});

export const collections = { changelog, components, docs, patterns, styles };
