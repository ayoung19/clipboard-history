import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { setClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";

let creating: Promise<void> | undefined; // A global promise to avoid concurrency issues
async function setupOffscreenDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const existingContexts = await chrome.runtime.getContexts({
    // contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [OFFSCREEN_DOCUMENT_PATH],
  });

  if (existingContexts.length > 0) {
    return;
  }

  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "Write text to the clipboard.",
    });
    await creating;
    creating = undefined;
  }
}

setupOffscreenDocument();

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([setClipboardMonitorIsEnabled(true), setupOffscreenDocument()]);
});
