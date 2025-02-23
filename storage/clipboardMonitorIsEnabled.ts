import { Storage } from "@plasmohq/storage";

import { setActionIconAndBadgeBackgroundColor } from "~utils/actionBadge";

// Do not change this without a migration.
const CLIPBOARD_MONITOR_IS_ENABLED_STORAGE_KEY = "clipboardMonitorIsEnabled";

const storage = new Storage({
  area: "local",
});

export const watchClipboardMonitorIsEnabled = (
  cb: (clipboardMonitorIsEnabled: boolean) => void,
) => {
  return storage.watch({
    [CLIPBOARD_MONITOR_IS_ENABLED_STORAGE_KEY]: (c) => cb(!!c.newValue),
  });
};

export const getClipboardMonitorIsEnabled = async () =>
  !!(await storage.get(CLIPBOARD_MONITOR_IS_ENABLED_STORAGE_KEY));

export const setClipboardMonitorIsEnabled = async (enabled: boolean) => {
  await Promise.all([
    enabled
      ? storage.set(CLIPBOARD_MONITOR_IS_ENABLED_STORAGE_KEY, "1")
      : storage.remove(CLIPBOARD_MONITOR_IS_ENABLED_STORAGE_KEY),
    setActionIconAndBadgeBackgroundColor(enabled),
  ]);
};

export const toggleClipboardMonitorIsEnabled = async () =>
  await setClipboardMonitorIsEnabled(!(await getClipboardMonitorIsEnabled()));
