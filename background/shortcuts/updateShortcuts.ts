import { type ShortcutStore } from "~types/shortcut";
import { setShortcuts } from "~utils/storage/shortcuts";

export const updateShortcuts = async () => {
  chrome.commands.getAll((commands) => {
    const shortcuts: ShortcutStore = {};
    commands.forEach((command) => {
      if (command.name && command.shortcut) {
        shortcuts[command.name] = {
          ...shortcuts[command.name],
          shortcut: command.shortcut,
        };
      }
    });
    setShortcuts(shortcuts);
  });
};
