import { createHash } from "crypto";
import { Err, Ok, Result } from "ts-results";

import { Storage } from "@plasmohq/storage";

import { _setEntryCommands, deleteEntryCommands, getEntryCommands } from "~storage/entryCommands";
import {
  deleteEntryIdsFromEntryIdToTags,
  getEntryIdToTags,
  setEntryIdToTags,
} from "~storage/entryIdToTags";
import { getFavoriteEntryIds, setFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getSettings } from "~storage/settings";
import { Entry } from "~types/entry";

import { removeActionBadgeText, setActionBadgeText } from "./actionBadge";
import { applyLocalItemLimit } from "./entries";

// Do not change this without a migration.
const ENTRIES_STORAGE_KEY = "entryIdSetentries";

const storage = new Storage({
  area: "local",
});

// Entries are not parsed to optimize for performance. This means corrupted entries will break the
// extension.
//
// TODO: Long poll to reset state of the extension in the event of corrupted entries.
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

// Entries are not parsed to optimize for performance. This means corrupted entries will break the
// extension.
//
// TODO: Long poll to reset state of the extension in the event of corrupted entries.
export const getEntries = async () => {
  const entries = await storage.get<Entry[]>(ENTRIES_STORAGE_KEY);
  if (entries === undefined) {
    return [];
  }

  return entries;
};

export const _setEntries = async (entries: Entry[]) => {
  const settings = await getSettings();

  await Promise.all([
    storage.set(ENTRIES_STORAGE_KEY, entries),
    settings.totalItemsBadge ? setActionBadgeText(entries.length) : removeActionBadgeText(),
  ]);
};

export const createEntry = async (content: string) => {
  const [entries, settings, favoriteEntryIds] = await Promise.all([
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

  await Promise.all([
    _setEntries(newEntries),
    skippedEntryIds.length > 0 && deleteEntryIdsFromEntryIdToTags(skippedEntryIds),
    skippedEntryIds.length > 0 && deleteEntryCommands(skippedEntryIds),
  ]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const s = new Set(entryIds);

  const [entries, favoriteEntryIds] = await Promise.all([getEntries(), getFavoriteEntryIds()]);
  // Favorited entries cannot be deleted.
  favoriteEntryIds.forEach((entryId) => s.delete(entryId));

  await Promise.all([
    _setEntries(entries.filter(({ id }) => !s.has(id))),
    deleteEntryIdsFromEntryIdToTags(entryIds),
    deleteEntryCommands(entryIds),
  ]);
};

export const updateEntryContent = async (
  entryId: string,
  content: string,
): Promise<Result<undefined, "content must be unique">> => {
  const [entries, favoriteEntryIds, entryIdToTags, entryCommands] = await Promise.all([
    getEntries(),
    getFavoriteEntryIds(),
    getEntryIdToTags(),
    getEntryCommands(),
  ]);

  const newEntryId = createHash("sha256").update(content).digest("hex");

  if (entries.some((entry) => entry.id === newEntryId)) {
    return Err("content must be unique");
  }

  const tags = entryIdToTags[entryId];
  if (tags !== undefined) {
    entryIdToTags[newEntryId] = [...tags];
  }
  delete entryIdToTags[entryId];

  await Promise.all([
    _setEntries(
      entries.map((entry) =>
        entry.id === entryId ? { ...entry, id: newEntryId, content } : entry,
      ),
    ),
    setFavoriteEntryIds(
      favoriteEntryIds.map((favoriteEntryId) =>
        favoriteEntryId === entryId ? newEntryId : favoriteEntryId,
      ),
    ),
    setEntryIdToTags(entryIdToTags),
    _setEntryCommands(
      entryCommands.map((entryCommand) =>
        entryCommand.entryId === entryId ? { ...entryCommand, entryId: newEntryId } : entryCommand,
      ),
    ),
  ]);

  return Ok(undefined);
};
