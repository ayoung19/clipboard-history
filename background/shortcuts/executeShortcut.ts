import { paste } from "~background";
import { getEntries } from "~utils/storage/entries";
import { getShortcuts } from "~utils/storage/shortcuts";

export const executeShortcut = async (command: string, tabId: number) => {
  const entries = await getEntries();
  const shortcuts = await getShortcuts();

  const shortcutToExecute = shortcuts.find((shortcut) => shortcut.commandName === command);
  if (!shortcutToExecute) {
    return;
  }

  const entryToPaste = entries.find((entry) => entry.id === shortcutToExecute.entryId);
  if (entryToPaste?.content) {
    chrome.scripting.executeScript({
      target: {
        tabId,
      },
      func: paste,
      args: [entryToPaste.content],
    });
  }
};
