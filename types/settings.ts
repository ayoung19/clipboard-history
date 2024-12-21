import { z } from "zod";

import { Tab } from "./tab";

// DO NOT REUSE DEPRECATED FIELDS.
export const defaultSettings = {
  totalItemsBadge: true,
  allowBlankItems: true,
  defaultTab: Tab.Enum.All,
  // theme: "light",
  themeV2: "system",
  localItemLimit: null,
  _email: null,
};

export const Settings = z
  .object({
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    allowBlankItems: z.boolean().default(defaultSettings.allowBlankItems),
    defaultTab: Tab.default(defaultSettings.defaultTab),
    // theme: z.string().default(defaultSettings.theme),
    themeV2: z.string().default(defaultSettings.themeV2),
    localItemLimit: z.number().nullable().default(defaultSettings.localItemLimit),
    _email: z.string().nullable().default(defaultSettings._email),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
