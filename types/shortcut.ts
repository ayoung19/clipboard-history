import { z } from "zod";

export const Shortcut = z.object({
  commandName: z.string(),
  shortcut: z.string(),
  entryId: z.optional(z.string()),
});
export type Shortcut = z.infer<typeof Shortcut>;
