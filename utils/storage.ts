import { createHash } from "crypto";

import { Storage } from "@plasmohq/storage";

import { getFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getSettings } from "~storage/settings";
import { Entry } from "~types/entry";

import { removeActionBadgeText, setActionBadgeText } from "./actionBadge";
import { applyLocalItemLimit } from "./entries";

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
  const [settings, favoriteEntryIds] = await Promise.all([getSettings(), getFavoriteEntryIds()]);
  const newEntries =
    settings.localItemLimit === null
      ? entries
      : applyLocalItemLimit(entries, new Set(favoriteEntryIds), settings.localItemLimit);

  await Promise.all([
    storage.set(ENTRIES_STORAGE_KEY, newEntries),
    settings.totalItemsBadge ? setActionBadgeText(newEntries.length) : removeActionBadgeText(),
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
