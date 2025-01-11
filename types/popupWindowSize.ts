import { z } from "zod";

export const PopupSize = z.enum(["sm", "md", "lg"]);
export type PopupSize = z.infer<typeof PopupSize>;

export const PopupSizeMap = {
  sm: { height: 300, width: 500 },
  md: { height: 500, width: 700 },
  lg: { height: 600, width: 800 },
} as const;

export type PopupSizeDimensions = (typeof PopupSizeMap)[PopupSize];
