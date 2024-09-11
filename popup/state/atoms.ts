import { atom } from "jotai";
import type { ReactNode } from "react";

import type { Entry } from "~types/entry";
import { Page } from "~types/page";

export const pageAtom = atom<Page>(Page.All);
export const searchAtom = atom("");
export const keyAtom = atom<string>();

export const entriesAtom = atom<Entry[]>([]);
export const reversedEntriesAtom = atom((get) => get(entriesAtom).toReversed());
export const unlockedReversedEntriesAtom = atom((get) =>
  get(reversedEntriesAtom).flatMap(({ cryptoInfo, ...rest }) =>
    cryptoInfo === undefined ? [rest] : [],
  ),
);
export const lockedReversedEntriesAtom = atom((get) =>
  get(reversedEntriesAtom).flatMap(({ cryptoInfo, ...rest }) =>
    cryptoInfo !== undefined ? [{ ...rest, cryptoInfo }] : [],
  ),
);

export const clipboardContentAtom = atom<string>();

export const modalAtom = atom<{
  opened: boolean;
  modalContent: ReactNode;
}>({ opened: false, modalContent: null });
