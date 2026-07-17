import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { markdownResponse } from '../../lib/page-source';

// Raw-markdown twin of every styles page: /styles/<slug>.md serves the page's
// markdown source as plain text (for copying into an AI, say). Rest param
// because styles ids nest (e.g. typography/lists), mirroring [...slug].astro.
export async function getStaticPaths() {
  const entries = await getCollection('styles');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: CollectionEntry<'styles'> }> = ({
  props,
}) => markdownResponse(props.entry);
