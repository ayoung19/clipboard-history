import { getShortcuts, setShortcuts } from "~storage/shortcuts";
import { type CommandNameToShortcut } from "~types/shortcut";

export const createShortcutMap = async () => {
  chrome.commands.getAll(async (commands) => {
    const shortcuts: CommandNameToShortcut = await getShortcuts();
    commands.forEach((command) => {
      if (command.name && command.shortcut) {
        shortcuts[command.name] = {
          ...shortcuts[command.name],
          shortcut: command.shortcut,
        };
      }
    });
    await setShortcuts(shortcuts);
  });
};
