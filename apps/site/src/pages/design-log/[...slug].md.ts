import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { markdownResponse } from '../../lib/page-source';

export async function getStaticPaths() {
  const entries = await getCollection('designLog');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: CollectionEntry<'designLog'> }> = ({
  props,
}) => markdownResponse(props.entry);
