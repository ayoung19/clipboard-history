import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { handleCreateEntryRequest } from "~background/messages/createEntry";
import {
  getClipboardMonitorIsEnabled,
  setClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getSettings } from "~storage/settings";
import {
  removeActionBadgeText,
  setActionBadgeText,
  setActionIconAndBadgeBackgroundColor,
} from "~utils/actionBadge";
import { watchClipboard } from "~utils/background";
import { getEntries } from "~utils/storage";

// Firefox MV2 creates a persistent background page that we can use to watch the clipboard.
if (process.env.PLASMO_TARGET === "firefox-mv2") {
  watchClipboard(window, document, (content) =>
    handleCreateEntryRequest({
      content,
      // Race condition with popup. Adding this delay in the recorded timestamp allows the
      // clipboard monitor to fail to create an entry when racing with the popup. It will succeed
      // on the next interval as long as the popup doesn't write to clipboardSnapshot again.
      timestamp: Date.now() - 1000,
    }),
  );
}

// A global promise to avoid concurrency issues.
let creating: Promise<void> | null = null;
const setupOffscreenDocument = async () => {
  // Firefox MV2 does not support chrome.offscreen.
  if (process.env.PLASMO_TARGET === "firefox-mv2") {
    return;
  }

  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "Read text from clipboard.",
    });
    await creating;
    creating = null;
  }
};

const setupAction = async () => {
  const [entries, clipboardMonitorIsEnabled, settings] = await Promise.all([
    getEntries(),
    getClipboardMonitorIsEnabled(),
    getSettings(),
  ]);

  await Promise.all([
    settings.totalItemsBadge ? setActionBadgeText(entries.length) : removeActionBadgeText(),
    setActionIconAndBadgeBackgroundColor(clipboardMonitorIsEnabled),
  ]);
};

chrome.tabs.onActivated.addListener(async () => {
  await Promise.all([setupOffscreenDocument(), setupAction()]);
});

chrome.runtime.onSuspend.addListener(async () => {
  // Firefox MV2 does not support chrome.offscreen.
  if (process.env.PLASMO_TARGET === "firefox-mv2") {
    return;
  }

  await chrome.offscreen.closeDocument();
});

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([setClipboardMonitorIsEnabled(true), setupOffscreenDocument(), setupAction()]);
});

let lastEntries: any = [];

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    title: "Search: %s",
    id: "parent",
    contexts: ["page", "editable"],
  });

  const updateContextMenu = async () => {
    const entries = await getEntries();

    if (!arraysEqual(entries, lastEntries)) {
      lastEntries = [...entries];

      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          title: "Open clipboard history",
          id: "parent",
          contexts: ["page", "editable"],
        });

        for (let i = 0; i < entries.length; i++) {
          chrome.contextMenus.create({
            id: `${i}`,
            title: `"${entries[i]?.content ?? "No Content"}"`,
            parentId: "parent",
            contexts: ["page", "editable"],
          });
        }
      });
    }
  };

  // Utility function to compare two arrays
  function arraysEqual(a: any, b: any) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].content !== b[i].content) return false;
    }
    return true;
  }

  await updateContextMenu();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateEntries") {
      console.log("goe message");
      updateContextMenu();
    }
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info.menuItemId);

    const index = typeof info.menuItemId == "string" ? parseInt(info.menuItemId) : 0;

    //need to get the clicked element

    //change its value from here

    // console.log(window.getSelection());

    console.log(lastEntries[index].content);
  });
});
