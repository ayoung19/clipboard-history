import iconOff128Src from "data-base64:~assets/iconOff128.png";
import iconOn128Src from "data-base64:~assets/iconOn128.png";

import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

export const getClipboardMonitorIsEnabled = async () => {
  return !!(await storage.get("clipboardMonitorIsEnabled"));
};

export const setClipboardMonitorIsEnabled = async (enabled: boolean) =>
  enabled
    ? await Promise.all([
        storage.set("clipboardMonitorIsEnabled", "1"),
        chrome.action.setIcon({ path: { "32": iconOn128Src } }),
        chrome.action.setBadgeBackgroundColor({ color: "#4263eb" }),
      ])
    : await Promise.all([
        storage.remove("clipboardMonitorIsEnabled"),
        chrome.action.setIcon({ path: { "32": iconOff128Src } }),
        chrome.action.setBadgeBackgroundColor({ color: "#495057" }),
      ]);

export const toggleClipboardMonitorIsEnabled = async () => {
  await setClipboardMonitorIsEnabled(!(await getClipboardMonitorIsEnabled()));
};
