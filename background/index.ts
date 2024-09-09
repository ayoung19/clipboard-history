import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { setClipboardMonitorIsEnabled } from "~storage/clipboardMonitor";

chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([
    setClipboardMonitorIsEnabled(true),
    chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "Write text to the clipboard.",
    }),
  ]);
});
