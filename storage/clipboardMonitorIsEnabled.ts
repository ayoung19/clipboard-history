import { Storage } from "@plasmohq/storage";

import { setActionIconAndBadgeBackgroundColor } from "~utils/actionBadge";

const storage = new Storage({
  area: "local",
});

export const getClipboardMonitorIsEnabled = async () =>
  !!(await storage.get("clipboardMonitorIsEnabled"));

export const setClipboardMonitorIsEnabled = async (enabled: boolean) => {
  await Promise.all([
    enabled
      ? storage.set("clipboardMonitorIsEnabled", "1")
      : storage.remove("clipboardMonitorIsEnabled"),
    setActionIconAndBadgeBackgroundColor(enabled),
  ]);
};

export const toggleClipboardMonitorIsEnabled = async () =>
  await setClipboardMonitorIsEnabled(!(await getClipboardMonitorIsEnabled()));
