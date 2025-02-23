import { createHash } from "crypto";
import { lookup } from "@instantdb/core";
import { Err, Ok, Result } from "ts-results";

import { Storage } from "@plasmohq/storage";

import { handleUpdateTotalItemsBadgeRequest } from "~background/messages/updateTotalItemsBadge";
import { _setEntryCommands, deleteEntryCommands, getEntryCommands } from "~storage/entryCommands";
import {
  _setEntryIdToTags,
  deleteEntryIdsFromEntryIdToTags,
  getEntryIdToTags,
} from "~storage/entryIdToTags";
import { _setFavoriteEntryIds, getFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getSettings } from "~storage/settings";
import { Entry } from "~types/entry";
import { StorageLocation } from "~types/storageLocation";

import db from "./db/core";
import { applyLocalItemLimit, handleEntryIds } from "./entries";

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
  await Promise.all([
    storage.set(ENTRIES_STORAGE_KEY, entries),
    handleUpdateTotalItemsBadgeRequest(entries.length),
  ]);
};

// TODO: Move cloud logic here to make merging work.
export const createEntry = async (content: string) => {
  const settings = await getSettings();

  if (settings.storageLocation === StorageLocation.Enum.Cloud) {
    const user = await db.getAuth();

    const contentHash = createHash("sha256").update(content).digest("hex");

    await db.transact(
      db.tx.entries[lookup("emailContentHash", `${user.email}+${contentHash}`)]!.update({
        createdAt: Date.now(),
        content: content,
      }).link({ $user: lookup("email", user.email) }),
    );

    return;
  }

  const [entries, favoriteEntryIds] = await Promise.all([
    getEntries(),
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
  await handleEntryIds({
    entryIds,
    handleLocalEntryIds: async (localEntryIds) => {
      const s = new Set(localEntryIds);

      const [entries, favoriteEntryIds] = await Promise.all([getEntries(), getFavoriteEntryIds()]);
      // Favorited entries cannot be deleted.
      favoriteEntryIds.forEach((entryId) => s.delete(entryId));

      await Promise.all([
        _setEntries(entries.filter(({ id }) => !s.has(id))),
        deleteEntryIdsFromEntryIdToTags(localEntryIds),
        deleteEntryCommands(localEntryIds),
      ]);
    },
    handleCloudEntryIds: async (cloudEntryIds) => {
      await db.transact(cloudEntryIds.map((cloudEntryId) => db.tx.entries[cloudEntryId]!.delete()));
    },
  });
};

export const updateEntryContent = async (
  entryId: string,
  content: string,
): Promise<Result<undefined, "content must be unique">> => {
  if (entryId.length === 36) {
    const [user, entriesQuery] = await Promise.all([
      db.getAuth(),
      db.queryOnce({
        entries: {
          $: {
            where: {
              content,
            },
          },
        },
      }),
    ]);

    if (entriesQuery.data.entries.length > 0) {
      return Err("content must be unique");
    }

    await db.transact(
      db.tx.entries[entryId]!.update({
        content,
        emailContentHash: `${user.email}+${createHash("sha256").update(content).digest("hex")}`,
      }),
    );

    return Ok(undefined);
  }

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
    _setFavoriteEntryIds(
      favoriteEntryIds.map((favoriteEntryId) =>
        favoriteEntryId === entryId ? newEntryId : favoriteEntryId,
      ),
    ),
    _setEntryIdToTags(entryIdToTags),
    _setEntryCommands(
      entryCommands.map((entryCommand) =>
        entryCommand.entryId === entryId ? { ...entryCommand, entryId: newEntryId } : entryCommand,
      ),
    ),
  ]);

  return Ok(undefined);
};
