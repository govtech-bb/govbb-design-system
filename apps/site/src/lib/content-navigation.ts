interface ContentEntry {
  id: string;
  data: { title: string };
}

export function getContentNeighbors(
  entries: ContentEntry[],
  currentId: string,
  basePath: string,
) {
  const index = entries.findIndex((entry) => entry.id === currentId);
  const toLink = (entry?: ContentEntry) =>
    entry
      ? { label: entry.data.title, href: `${basePath}${entry.id}/` }
      : undefined;

  return {
    previous: toLink(index > 0 ? entries[index - 1] : undefined),
    next: toLink(index >= 0 ? entries[index + 1] : undefined),
  };
}
