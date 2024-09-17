import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import {
  getClipboardMonitorIsEnabled,
  setClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { setActionBadgeText, setActionIconAndBadgeBackgroundColor } from "~utils/actionBadge";
import { getEntries } from "~utils/storage";

// A global promise to avoid concurrency issues.
let creating: Promise<void> | null = null;
const setupOffscreenDocument = async () => {
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
  const [entries, clipboardMonitorIsEnabled] = await Promise.all([
    getEntries(),
    getClipboardMonitorIsEnabled(),
  ]);

  await Promise.all([
    setActionBadgeText(entries.length),
    setActionIconAndBadgeBackgroundColor(clipboardMonitorIsEnabled),
  ]);
};

chrome.tabs.onActivated.addListener(async () => {
  await Promise.all([setupOffscreenDocument(), setupAction()]);
});

chrome.runtime.onSuspend.addListener(async () => {
  await chrome.offscreen.closeDocument();
});

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([setClipboardMonitorIsEnabled(true), setupOffscreenDocument(), setupAction()]);
});
