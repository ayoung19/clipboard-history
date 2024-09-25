import type { Entry } from "~types/entry";

export const applyLocalItemLimit = (
  entries: Entry[],
  favoriteEntryIdSet: Set<string>,
  localItemLimit: number,
) =>
  entries
    .reduceRight<[Entry[], number]>(
      (acc, curr) => {
        if (favoriteEntryIdSet.has(curr.id)) {
          acc[0].push(curr);
          return acc;
        }

        if (acc[1] < localItemLimit) {
          acc[0].push(curr);
          acc[1] += 1;
          return acc;
        }

        return acc;
      },
      [[], 0],
    )[0]
    .reverse();
