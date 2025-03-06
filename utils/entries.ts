import type { Entry } from "~types/entry";
import type { Settings } from "~types/settings";

export const reverseMergeSortedEntries = (localEntries: Entry[], cloudEntries: Entry[]) => {
  let i = localEntries.length - 1;
  let j = cloudEntries.length - 1;

  const out: Entry[] = [];

  while (i >= 0 && j >= 0) {
    const localEntry = localEntries[i]!;
    const cloudEntry = cloudEntries[j]!;

    if (localEntry.createdAt > cloudEntry.createdAt) {
      out.push(localEntry);
      i--;
    } else {
      out.push(cloudEntry);
      j--;
    }
  }

  while (i >= 0) {
    const localEntry = localEntries[i]!;
    out.push(localEntry);
    i--;
  }

  while (j >= 0) {
    const cloudEntry = cloudEntries[j]!;
    out.push(cloudEntry);
    j--;
  }

  return out;
};

export const handleEntryIds = async ({
  entryIds,
  handleLocalEntryIds,
  handleCloudEntryIds,
}: {
  entryIds: string[];
  handleLocalEntryIds: (entryIds: string[]) => Promise<void>;
  handleCloudEntryIds: (entryIds: string[]) => Promise<void>;
}) => {
  const localEntryIds = entryIds.filter((entryId) => entryId.length !== 36);
  const cloudEntryIds = entryIds.filter((entryId) => entryId.length === 36);

  const results = await Promise.allSettled([
    localEntryIds.length > 0 && handleLocalEntryIds(localEntryIds),
    cloudEntryIds.length > 0 && handleCloudEntryIds(cloudEntryIds),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.log(result.reason);
    }
  }
};

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
