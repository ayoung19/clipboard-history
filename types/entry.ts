import { z } from "zod";

export const Entry = z.object({
  id: z.string(),
  createdAt: z.number(),
  copiedAt: z.number().optional(),
  content: z.string(),
});
export type Entry = z.infer<typeof Entry>;
