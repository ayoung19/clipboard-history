import { z } from "zod";

export const PopupSize = z.enum(["sm", "md", "lg"]);
export type PopupSize = z.infer<typeof PopupSize>;

export const PopupSizeMap = {
  sm: { height: 400, width: 300 },
  md: { height: 500, width: 500 },
  lg: { height: 600, width: 700 },
} as const;

export type PopupSizeDimensions = (typeof PopupSizeMap)[PopupSize];
