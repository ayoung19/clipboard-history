import { Storage } from "@plasmohq/storage";

import { CommandNameToShortcut } from "~types/shortcut";

// don't change without a migration
const SHORTCUTS_STORAGE_KEY = "shortcutIdSetentries";

const storage = new Storage({
  area: "local",
});

export const watchShortcuts = (cb: (shortcutStore: CommandNameToShortcut) => void) => {
  return storage.watch({
    [SHORTCUTS_STORAGE_KEY]: (c) => {
      const parsed = CommandNameToShortcut.safeParse(c.newValue);

      cb(parsed.success ? parsed.data : {});
    },
  });
};

export const getShortcuts = async () => {
  const parsed = CommandNameToShortcut.safeParse(
    await storage.get<CommandNameToShortcut>(SHORTCUTS_STORAGE_KEY),
  );

  return parsed.success ? parsed.data : {};
};

export const setShortcuts = async (shortcuts: CommandNameToShortcut) => {
  await storage.set(SHORTCUTS_STORAGE_KEY, shortcuts);
};
