import { z } from "zod";

import { StorageLocation } from "./storageLocation";
import { Tab } from "./tab";

// DO NOT REUSE DEPRECATED FIELDS.
export const defaultSettings = {
  storageLocation: StorageLocation.Enum.Local,
  totalItemsBadge: true,
  changelogIndicator: true,
  allowBlankItems: true,
  defaultTab: Tab.Enum.All,
  // theme: "light",
  themeV2: "system",
  localItemLimit: null,
  localItemCharacterLimit: null,
};

export const Settings = z
  .object({
    storageLocation: StorageLocation.default(defaultSettings.storageLocation),
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    changelogIndicator: z.boolean().default(defaultSettings.changelogIndicator),
    allowBlankItems: z.boolean().default(defaultSettings.allowBlankItems),
    defaultTab: Tab.default(defaultSettings.defaultTab),
    // theme: z.string().default(defaultSettings.theme),
    themeV2: z.string().default(defaultSettings.themeV2),
    localItemLimit: z.number().nullable().default(defaultSettings.localItemLimit),
    localItemCharacterLimit: z.number().nullable().default(defaultSettings.localItemCharacterLimit),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
