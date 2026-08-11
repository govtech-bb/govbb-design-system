import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Design log: dated posts recording design decisions, research findings and
// other working notes behind the system.
const designLog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/design-log' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    summary: z.string().optional(),
    /** What kind of entry this is; drives the badge on the overview page. */
    kind: z.enum(['decision', 'research', 'note']).default('decision'),
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
    /** Frontend-package component directory whose CSS drives the "Tokens
        used" section, when it differs from the page id (e.g. checkbox and
        radio both live in checkbox-radio). */
    css: z.string().optional(),
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
    /** Display order in the sidebar and overview cards. */
    order: z.number().default(99),
  }),
});

// Patterns: task-level guidance composing several components. Grouped GOV.UK
// style into "Ask users for …" and "Help users to …".
const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lede: z.string(),
    group: z.enum(['Build forms', 'Ask users for', 'Help users to']),
  }),
});

// Templates: whole-page scaffolds to copy as a starting point - error pages,
// service pages (landing/start), authentication, and the generic form page.
// Patterns say how to solve a task; templates give you the page to fill in.
const templates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/templates' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lede: z.string(),
    group: z.enum(['Error pages', 'Service pages', 'Authentication', 'Forms']),
  }),
});

// AI skills. Unlike every other collection these files are not authored for the
// site: they are the `SKILL.md` files an agent actually loads, read from the
// repository root. Publishing the same file the agent reads is deliberate — a
// hand-written summary beside it would be a second description of the skill,
// free to drift from the instructions it describes.
//
// `metadata` mirrors the frontmatter contract in docs/plans/ai-skills.md. The
// skills CLI and Claude Code read only `name` and `description`; everything
// under `metadata` exists for this site and is ignored by both.
const skills = defineCollection({
  loader: glob({
    pattern: '*/SKILL.md',
    base: '../../skills',
    // Without this the id would be "<name>/SKILL", which is not a URL anyone
    // wants. The directory name is the skill name.
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    metadata: z.object({
      title: z.string(),
      /** `design-team` skills are not published; see publishedSkills(). */
      audience: z.enum(['public', 'design-team']).default('public'),
      /** Matches the maturity vocabulary used for components. */
      status: z.enum(['experimental', 'supported']).default('experimental'),
      /** Tools a reader must have before the skill can do its job. */
      requires: z.array(z.string()).default([]),
      /** Belt-and-braces exclusion; see publishedSkills(). */
      internal: z.boolean().default(false),
    }),
  }),
});

export const collections = {
  designLog,
  components,
  docs,
  styles,
  patterns,
  templates,
  skills,
};
