import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { setClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { setActionBadge } from "~utils/actionBadge";
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

const getEntriesAndSetActionBadge = async () => {
  const entries = await getEntries();
  await setActionBadge(entries.length);
};

chrome.tabs.onActivated.addListener(() =>
  Promise.all([setupOffscreenDocument(), getEntriesAndSetActionBadge()]),
);

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([
    setClipboardMonitorIsEnabled(true),
    Promise.all([setupOffscreenDocument(), getEntriesAndSetActionBadge()]),
  ]);
});
