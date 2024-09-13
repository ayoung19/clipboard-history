import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { setClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";

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

chrome.tabs.onActivated.addListener(() => setupOffscreenDocument());

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([setClipboardMonitorIsEnabled(true), setupOffscreenDocument()]);
});
