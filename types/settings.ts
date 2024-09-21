import { z } from "zod";

export const defaultSettings = {
  totalItemsBadge: true,
  theme: "system",
};

export const Settings = z
  .object({
    totalItemsBadge: z.boolean().default(defaultSettings.totalItemsBadge),
    theme: z.string().default(defaultSettings.theme),
  })
  .default(defaultSettings);
export type Settings = z.infer<typeof Settings>;
