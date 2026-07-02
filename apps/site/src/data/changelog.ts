import { getCollection } from 'astro:content';

/** Changelog entries, newest first. */
export async function getSortedChangelog() {
  const posts = await getCollection('changelog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Format a changelog date consistently across the site (e.g. "1 July 2026"). */
export const formatChangelogDate = (date: Date): string =>
  dateFormat.format(date);
