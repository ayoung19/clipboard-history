import { z } from "zod";

const Shortcut = z.object({
  shortcut: z.string(),
  entryId: z.optional(z.string()),
});
export type Shortcut = z.infer<typeof Shortcut>;

const ShortcutStore = z.record(z.string(), Shortcut)
export type ShortcutStore = z.infer<typeof ShortcutStore>;