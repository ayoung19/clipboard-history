import { paste } from "~background";
import { getShortcuts } from "~storage/shortcuts";
import { getEntries } from "~utils/storage";

export const executeShortcut = async (command: string, tabId: number) => {
  const entries = await getEntries();
  const shortcuts = await getShortcuts();

  if (!shortcuts) {
    return;
  }
  const shortcutToExecute = shortcuts[command];
  if (!shortcutToExecute) {
    return;
  }

  const entryToPaste = entries.find((entry) => entry.id === shortcutToExecute.entryId);
  if (entryToPaste?.content) {
    await chrome.scripting.executeScript({
      target: {
        tabId,
      },
      func: paste,
      args: [entryToPaste.content],
    });
  }
};
