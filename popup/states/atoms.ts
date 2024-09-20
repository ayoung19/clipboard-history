import { max } from "date-fns";
import { atom } from "jotai";

import { ClipboardSnapshot } from "~types/clipboardSnapshot";
import { Entry } from "~types/entry";
import { defaultSettings, Settings } from "~types/settings";

export const tabAtom = atom<string>("all");
export const searchAtom = atom<string>("");

export const entriesAtom = atom<Entry[]>([]);
export const reversedEntriesAtom = atom((get) => get(entriesAtom).toReversed());

export const clipboardSnapshotAtom = atom<ClipboardSnapshot>();

export const favoriteEntryIdsAtom = atom<string[]>([]);
export const favoriteEntryIdsSetAtom = atom((get) => new Set(get(favoriteEntryIdsAtom)));

export const settingsAtom = atom(defaultSettings);

const staticNowAtom = atom(() => new Date());
export const nowAtom = atom((get) =>
  max([new Date(get(reversedEntriesAtom)[0]?.createdAt || 0), get(staticNowAtom)]),
);
