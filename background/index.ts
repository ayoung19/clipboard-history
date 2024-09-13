import OFFSCREEN_DOCUMENT_PATH from "url:~offscreen.html";

import { Storage } from "@plasmohq/storage";

import { setClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { Entry } from "~types/entry";
import { setEntries } from "~utils/storage";

const entryIdSetNamespaceRemoveAll = async () => {
  const entryIdSetStorage = new Storage({
    area: "local",
  });
  entryIdSetStorage.setNamespace("entryIdSet");

  return await entryIdSetStorage.removeAll();
};

const storage = new Storage({
  area: "local",
});

const setupOffscreenDocument = async () => {
  // TODO: Remove this migration.
  // BEGIN: Migrate entries over to new storage namespace.
  const oldEntries = await storage.get<Entry[]>("entryIdSetentries");
  if (oldEntries !== undefined && oldEntries.length > 0) {
    await setEntries(oldEntries);
    await storage.remove("clipboardSnapshot");
    await entryIdSetNamespaceRemoveAll();
  }
  // END: Migrate entries over to new storage namespace.

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
