import { createHash } from "crypto";

import { Storage } from "@plasmohq/storage";

import { getEntryIdToTags, setEntryIdToTags } from "~storage/entryIdToTags";
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
  chrome.runtime.sendMessage({ type: "updateEntries" });
  return entries;
};

export const setEntries = async (entries: Entry[]) => {
  const settings = await getSettings();

  await Promise.all([
    storage.set(ENTRIES_STORAGE_KEY, entries),
    settings.totalItemsBadge ? setActionBadgeText(entries.length) : removeActionBadgeText(),
  ]);
};

export const createEntry = async (content: string) => {
  const [entries, settings, favoriteEntryIds, entryIdToTags] = await Promise.all([
    getEntries(),
    getSettings(),
    getFavoriteEntryIds(),
    getEntryIdToTags(),
  ]);

  const entryId = createHash("sha256").update(content).digest("hex");

  const [newEntries, skippedEntryIds] = applyLocalItemLimit(
    [
      ...entries.filter(({ id }) => id !== entryId),
      {
        id: entryId,
        createdAt: Date.now(),
        content,
      },
    ],
    settings,
    favoriteEntryIds,
  );
  skippedEntryIds.forEach((entryId) => delete entryIdToTags[entryId]);

  await Promise.all([
    setEntries(newEntries),
    ...(skippedEntryIds.length > 0 ? [setEntryIdToTags(entryIdToTags)] : []),
  ]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const entryIdSet = new Set(entryIds);

  const [entries, entryIdToTags] = await Promise.all([getEntries(), getEntryIdToTags()]);
  entryIds.forEach((entryId) => delete entryIdToTags[entryId]);
  chrome.runtime.sendMessage({ type: "updateEntries" });
  await Promise.all([
    setEntries(entries.filter(({ id }) => !entryIdSet.has(id))),
    setEntryIdToTags(entryIdToTags),
  ]);
};
