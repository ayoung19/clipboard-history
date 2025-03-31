import { createHash } from "crypto";

import { _setEntryIdToTags, getEntryIdToTags } from "~storage/entryIdToTags";
import { addFavoriteEntryIds, getFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { ClipboardHistoryIOExport, ClipboardHistoryProExport } from "~types/importExport";

import { _setEntries, getEntries } from "./storage";

export const getClipboardHistoryIOExport = async (): Promise<ClipboardHistoryIOExport> => {
  const [entries, entryIdToTags, favoriteEntryIds] = await Promise.all([
    getEntries(),
    getEntryIdToTags(),
    getFavoriteEntryIds(),
  ]);

  const favoriteEntryIdSet = new Set(favoriteEntryIds);

  return entries.map((entry) => ({
    createdAt: entry.createdAt,
    copiedAt: entry.copiedAt,
    content: entry.content,
    tags: entryIdToTags[entry.id],
    isFavorite: favoriteEntryIdSet.has(entry.id) || undefined,
  }));
};

export const importFile = async (file: File) => {
  const text = await file.text();
  const json = JSON.parse(text);

  const clipboardHistoryIOParsed = ClipboardHistoryIOExport.safeParse(json);
  if (clipboardHistoryIOParsed.success) {
    return await importClipboardHistoryIO(clipboardHistoryIOParsed.data);
  }

  const clipboardHistoryProParsed = ClipboardHistoryProExport.safeParse(json);
  if (clipboardHistoryProParsed.success) {
    return await importClipboardHistoryPro(clipboardHistoryProParsed.data);
  }

  throw [clipboardHistoryIOParsed.error, clipboardHistoryProParsed.error];
};

const importClipboardHistoryIO = async (clipboardHistoryIOEntries: ClipboardHistoryIOExport) => {
  const [entries, entryIdToTags] = await Promise.all([getEntries(), getEntryIdToTags()]);
  const favoriteEntryIdsToBeAdded: string[] = [];

  // Merge new entries and tags with existing entries and tags.
  for (const clipboardHistoryIOEntry of clipboardHistoryIOEntries) {
    const entryId = createHash("sha256").update(clipboardHistoryIOEntry.content).digest("hex");

    entries.push({
      id: entryId,
      createdAt: clipboardHistoryIOEntry.createdAt,
      copiedAt: clipboardHistoryIOEntry.copiedAt,
      content: clipboardHistoryIOEntry.content,
    });

    if (clipboardHistoryIOEntry.isFavorite) {
      favoriteEntryIdsToBeAdded.push(entryId);
    }

    if (clipboardHistoryIOEntry.tags) {
      entryIdToTags[entryId] = Array.from(
        new Set([
          ...(entryIdToTags[entryId] || []),
          ...clipboardHistoryIOEntry.tags.map((tag) => tag.toLowerCase()),
        ]),
      );
    }
  }

  await Promise.all([
    _setEntries(
      Object.values(
        // Reduce duplicate entries. The smallest (oldest) createdAt and largest (newest) copiedAt values
        // should be the most correct.
        entries.reduce<Record<string, Entry>>((acc, curr) => {
          const entry = acc[curr.id];
          if (entry === undefined) {
            acc[curr.id] = curr;
          } else {
            entry.createdAt = Math.min(entry.createdAt, curr.createdAt);
            entry.copiedAt = Math.max(entry.copiedAt || 0, curr.copiedAt || 0) || undefined;
          }

          return acc;
        }, {}),
      ),
    ),
    _setEntryIdToTags(entryIdToTags),
    addFavoriteEntryIds(favoriteEntryIdsToBeAdded),
  ]);
};

const importClipboardHistoryPro = async (clipboardHistoryProEntries: ClipboardHistoryProExport) => {
  await importClipboardHistoryIO(
    clipboardHistoryProEntries.flatMap((clipboardHistoryProEntry) => {
      if (
        clipboardHistoryProEntry.text === undefined ||
        clipboardHistoryProEntry.dateAdded === undefined
      ) {
        return [];
      }

      return {
        createdAt: clipboardHistoryProEntry.dateAdded,
        copiedAt: clipboardHistoryProEntry.dateLastCopied,
        content: clipboardHistoryProEntry.text,
        tags: clipboardHistoryProEntry.tags,
        isFavorite: clipboardHistoryProEntry.isFavorite,
      };
    }),
  );
};
