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
  // Front-matter dates are authored as calendar dates (UTC midnight). Format in
  // UTC so a negative-offset build machine (e.g. Barbados, UTC-4) doesn't render
  // them a day early.
  timeZone: 'UTC',
});

/** Format a changelog date consistently across the site (e.g. "1 July 2026"). */
export const formatChangelogDate = (date: Date): string =>
  dateFormat.format(date);
