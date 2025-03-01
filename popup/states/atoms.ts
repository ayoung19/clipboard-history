import { max } from "date-fns";
import { atom } from "jotai";

import { ClipboardSnapshot } from "~types/clipboardSnapshot";
import { Entry } from "~types/entry";
import type { EntryCommand } from "~types/entryCommand";
import { EntryIdToTags } from "~types/entryIdToTags";
import { defaultSettings, Settings } from "~types/settings";
import { Tab } from "~types/tab";

export const searchAtom = atom<string>("");
export const tabAtom = atom<Tab>(Tab.Enum.All);

export const clipboardMonitorIsEnabledAtom = atom<boolean>();

export const entriesAtom = atom<Entry[]>([]);

export const clipboardSnapshotAtom = atom<ClipboardSnapshot>();

export const favoriteEntryIdsAtom = atom<string[]>([]);

export const settingsAtom = atom<Settings>(defaultSettings);

const staticNowAtom = atom(() => new Date());
export const nowAtom = atom((get) =>
  max([new Date(get(entriesAtom).at(-1)?.createdAt || 0), get(staticNowAtom)]),
);

export const entryIdToTagsAtom = atom<EntryIdToTags>({});

export const changelogViewedAtAtom = atom<string>();

export const entryCommandsAtom = atom<EntryCommand[]>([]);
export const commandsAtom = atom<{ name: string; shortcut?: string }[]>([]);

export const refreshTokenAtom = atom<string | null>(null);
