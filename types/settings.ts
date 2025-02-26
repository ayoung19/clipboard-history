import { z } from "zod";

import { PopupSize } from "./popupWindowSize";
import { Tab } from "./tab";

// DO NOT REUSE DEPRECATED FIELDS.
export const defaultSettings = {
  totalItemsBadge: true,
  changelogIndicator: true,
  allowBlankItems: true,
  defaultTab: Tab.Enum.All,
  // theme: "light",
  themeV2: "system",
  localItemLimit: null,
  localItemCharacterLimit: null,
  popupWindowSize: PopupSize.Enum.md,
};

export const Settings = z
  .object({
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    changelogIndicator: z.boolean().default(defaultSettings.changelogIndicator),
    allowBlankItems: z.boolean().default(defaultSettings.allowBlankItems),
    defaultTab: Tab.default(defaultSettings.defaultTab),
    // theme: z.string().default(defaultSettings.theme),
    themeV2: z.string().default(defaultSettings.themeV2),
    localItemLimit: z.number().nullable().default(defaultSettings.localItemLimit),
    localItemCharacterLimit: z.number().nullable().default(defaultSettings.localItemCharacterLimit),
    popupWindowSize: PopupSize.default(defaultSettings.popupWindowSize),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
