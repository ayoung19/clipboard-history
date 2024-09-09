import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

export const getClipboardMonitorIsEnabled = async () => {
  return !!(await storage.get("clipboardMonitorIsEnabled"));
};

export const setClipboardMonitorIsEnabled = async (enabled: boolean) =>
  enabled
    ? await storage.set("clipboardMonitorIsEnabled", "1")
    : await storage.remove("clipboardMonitorIsEnabled");

export const toggleClipboardMonitorIsEnabled = async () => {
  await setClipboardMonitorIsEnabled(!(await getClipboardMonitorIsEnabled()));
};
