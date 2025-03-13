import { z } from "zod";

export const EntryTimeUnit = z.enum(["Minutes", "Hours", "Days", "Months", "Years"]);
export type EntryTimeUnit = z.infer<typeof EntryTimeUnit>;

export const EntryTime = z.object({
  quantity: z.number(),
  unit: EntryTimeUnit,
});
export type EntryTime = z.infer<typeof EntryTime>;
