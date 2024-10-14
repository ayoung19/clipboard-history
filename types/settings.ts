import { z } from "zod";

// DO NOT REUSE DEPRECATED FIELDS.
export const defaultSettings = {
  totalItemsBadge: true,
  allowBlankItems: true,
  // theme: "light",
  themeV2: "system",
  localItemLimit: null,
};

export const Settings = z
  .object({
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    allowBlankItems: z.boolean().default(defaultSettings.allowBlankItems),
    // theme: z.string().default(defaultSettings.theme),
    themeV2: z.string().default(defaultSettings.themeV2),
    localItemLimit: z.number().nullable().default(defaultSettings.localItemLimit),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
