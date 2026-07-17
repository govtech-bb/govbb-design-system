import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { markdownResponse } from '../../lib/page-source';

// Raw-markdown twin of every pattern page: /patterns/<slug>.md serves the
// page's markdown source as plain text (for copying into an AI, say).
export async function getStaticPaths() {
  const entries = await getCollection('patterns');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: CollectionEntry<'patterns'> }> = ({
  props,
}) => markdownResponse(props.entry);
