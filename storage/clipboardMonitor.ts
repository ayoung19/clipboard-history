import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

export const getClipboardMonitorIsEnabled = async () => {
  return !!(await storage.get("clipboardMonitor"));
};

export const setClipboardMonitorIsEnabled = async (enabled: boolean) =>
  enabled ? await storage.set("clipboardMonitor", "1") : await storage.remove("clipboardMonitor");

export const toggleClipboardMonitorIsEnabled = async () => {
  await setClipboardMonitorIsEnabled(!(await getClipboardMonitorIsEnabled()));
};
