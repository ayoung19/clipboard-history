import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: "Write text to the clipboard.",
  });
});
