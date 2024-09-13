import { createHash } from "crypto";

import { Storage } from "@plasmohq/storage";

import { Entry } from "~types/entry";

import { setActionBadgeText } from "./actionBadge";

// Do not change this without a migration.
const ENTRIES_STORAGE_KEY = "entryIdSetentries";

const storage = new Storage({
  area: "local",
});

export const watchEntries = (cb: (entries: Entry[]) => void) => {
  return storage.watch({
    [ENTRIES_STORAGE_KEY]: (c) => {
      if (c.newValue === undefined) {
        cb([]);
      } else {
        cb(c.newValue as Entry[]);
      }
    },
  });
};

export const getEntries = async () => {
  const entries = await storage.get<Entry[]>(ENTRIES_STORAGE_KEY);
  if (entries === undefined) {
    return [];
  }

  return entries;
};

export const setEntries = async (entries: Entry[]) => {
  await Promise.all([
    storage.set(ENTRIES_STORAGE_KEY, entries),
    setActionBadgeText(entries.length),
  ]);
};

export const createEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  const entries = await getEntries();

  await setEntries([
    ...entries.filter(({ id }) => id !== entryId),
    {
      id: entryId,
      createdAt: Date.now(),
      content,
    },
  ]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const entryIdSet = new Set(entryIds);

  const entries = await getEntries();

  await setEntries(entries.filter(({ id }) => !entryIdSet.has(id)));
};
