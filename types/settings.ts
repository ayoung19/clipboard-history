import { z } from "zod";

// DO NOT REUSE DEPRECATED FIELDS.
export const defaultSettings = {
  totalItemsBadge: true,
  // theme: "light",
  themeV2: "system",
};

export const Settings = z
  .object({
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    // theme: z.string().default(defaultSettings.theme),
    themeV2: z.string().default(defaultSettings.themeV2),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
