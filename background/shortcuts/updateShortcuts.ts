import { Shortcut } from "~types/shortcut";
import { setShortcuts } from "~utils/storage/shortcuts";

export const updateShortcuts = async () => {
  chrome.commands.getAll((commands) => {
    const shortcuts: Shortcut[] = [];
    commands.forEach((command) => {
      if (command.name && command.shortcut) {
        shortcuts.push({
          commandName: command.name,
          shortcut: command.shortcut,
        });
      }
    });
    setShortcuts(shortcuts);
    console.log(shortcuts); // todo remove
  });
};
