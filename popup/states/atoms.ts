import { max } from "date-fns";
import { atom } from "jotai";

import { ClipboardSnapshot } from "~types/clipboardSnapshot";
import { Entry } from "~types/entry";
import { EntryIdToTags } from "~types/entryIdToTags";
import { defaultSettings, Settings } from "~types/settings";
import { entryIdToTagsToAllTags } from "~utils/entryIdToTags";

export const searchAtom = atom<string>("");

export const entriesAtom = atom<Entry[]>([]);
export const reversedEntriesAtom = atom((get) => get(entriesAtom).toReversed());

export const clipboardSnapshotAtom = atom<ClipboardSnapshot>();

export const favoriteEntryIdsAtom = atom<string[]>([]);
export const favoriteEntryIdsSetAtom = atom((get) => new Set(get(favoriteEntryIdsAtom)));

export const settingsAtom = atom<Settings>(defaultSettings);

const staticNowAtom = atom(() => new Date());
export const nowAtom = atom((get) =>
  max([new Date(get(reversedEntriesAtom)[0]?.createdAt || 0), get(staticNowAtom)]),
);

export const entryIdToTagsAtom = atom<EntryIdToTags>({});
export const allTagsAtom = atom((get) => entryIdToTagsToAllTags(get(entryIdToTagsAtom)));
