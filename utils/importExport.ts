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
    // Sort merged entries by createdAt in ascending order then remove
    // duplicate entries starting from the end of the list so that the most
    // recent copy is kept. Since reducing from the end of the list and pushing
    // to a new list will cause items to be in the reverse order, undo this
    // reversal by reversing the list after reducing.
    _setEntries(
      entries
        .sort((a, b) => a.createdAt - b.createdAt)
        .reduceRight<[Entry[], Set<string>]>(
          ([newEntries, seenEntries], curr) => {
            if (!seenEntries.has(curr.id)) {
              newEntries.push(curr);
              seenEntries.add(curr.id);
            }

            return [newEntries, seenEntries];
          },
          [[], new Set()],
        )[0]
        .reverse(),
    ),
    _setEntryIdToTags(entryIdToTags),
    addFavoriteEntryIds(favoriteEntryIdsToBeAdded),
  ]);
};

const importClipboardHistoryPro = async (clipboardHistoryProEntries: ClipboardHistoryProExport) => {
  await importClipboardHistoryIO(
    clipboardHistoryProEntries.flatMap((clipboardHistoryProEntry) => {
      if (clipboardHistoryProEntry.text === undefined) {
        return [];
      }

      const dateLastCopiedOrDateAdded =
        clipboardHistoryProEntry.dateLastCopied || clipboardHistoryProEntry.dateAdded;

      if (dateLastCopiedOrDateAdded === undefined) {
        return [];
      }

      return {
        createdAt: dateLastCopiedOrDateAdded,
        content: clipboardHistoryProEntry.text,
        tags: clipboardHistoryProEntry.tags,
        isFavorite: clipboardHistoryProEntry.isFavorite,
      };
    }),
  );
};
