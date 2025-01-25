import { Storage } from "@plasmohq/storage";

import type { Shortcut } from "~types/shortcut";

const SHORTCUTS_STORAGE_KEY = "shortcutIdSetentries";

const storage = new Storage({
  area: "local",
});

export const setShortcuts = async (shortcuts: Shortcut[]) => {
  await Promise.all([storage.set(SHORTCUTS_STORAGE_KEY, shortcuts)]);
};

export const getShortcuts = async () => {
  const shortcuts = await storage.get<Shortcut[]>(SHORTCUTS_STORAGE_KEY);
  if (shortcuts === undefined) {
    return [];
  }

  return shortcuts;
};
