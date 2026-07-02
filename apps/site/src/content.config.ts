import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
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

export const collections = { changelog };
