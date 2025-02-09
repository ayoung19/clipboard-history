import { z } from "zod";

const Shortcut = z.object({
  shortcut: z.string(),
  entryId: z.optional(z.string()),
});
export type Shortcut = z.infer<typeof Shortcut>;

export const CommandNameToShortcut = z.record(z.string(), Shortcut);
export type CommandNameToShortcut = z.infer<typeof CommandNameToShortcut>;
