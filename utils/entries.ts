import type { Entry } from "~types/entry";
import type { Settings } from "~types/settings";

export const applyLocalItemLimit = (
  entries: Entry[],
  { localItemLimit }: Settings,
  favoriteEntryIds: string[],
): [Entry[], string[]] => {
  if (localItemLimit === null) {
    return [entries, []];
  }

  const favoriteEntryIdSet = new Set(favoriteEntryIds);

  const [newEntries, skippedEntryIds] = entries.reduceRight<[Entry[], string[], number]>(
    (acc, curr) => {
      if (favoriteEntryIdSet.has(curr.id)) {
        acc[0].push(curr);
        return acc;
      }

      if (acc[2] < localItemLimit) {
        acc[0].push(curr);
        acc[2] += 1;
        return acc;
      }

      acc[1].push(curr.id);
      return acc;
    },
    [[], [], 0],
  );

  return [newEntries.reverse(), skippedEntryIds];
};
