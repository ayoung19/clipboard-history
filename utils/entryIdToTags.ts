import type { EntryIdToTags } from "~types/entryIdToTags";

export const entryIdToTagsToAllTags = (entryIdToTags: EntryIdToTags) =>
  Array.from(
    Object.values(entryIdToTags).reduce((acc, curr) => {
      curr.forEach((tag) => acc.add(tag));

      return acc;
    }, new Set<string>()),
  );
