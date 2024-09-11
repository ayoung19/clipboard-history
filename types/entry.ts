import { z } from "zod";

export const Entry = z.object({
  id: z.string(),
  createdAt: z.number(),
  content: z.string(),
  cryptoInfo: z
    .object({
      iv: z.string(),
      tag: z.string(),
    })
    .optional(),
});
export type Entry = z.infer<typeof Entry>;
