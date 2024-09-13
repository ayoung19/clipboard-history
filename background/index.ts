import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import {
  getClipboardMonitorIsEnabled,
  setClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { setActionIconAndBadgeBackgroundColor, setActionBadgeText } from "~utils/actionBadge";
import { getEntries } from "~utils/storage";

const setupOffscreenDocument = async () => {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: "Write text to the clipboard.",
  });
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

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([
    setClipboardMonitorIsEnabled(true),
    setupOffscreenDocument(),
    setupAction(),
  ]);
});
