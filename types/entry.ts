import { z } from "zod";

const imageUrlPattern = /\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i;

export const Entry = z.object({
  id: z.string(),
  createdAt: z.number(),
  content: z.string().refine((value) => !imageUrlPattern.test(value)),
});
export type Entry = z.infer<typeof Entry>;
