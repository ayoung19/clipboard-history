import { z } from "zod";

export const EntryLifetimeUnit = z.enum(["Minutes", "Hours", "Days", "Months", "Years"]);
export type EntryLifetimeUnit = z.infer<typeof EntryLifetimeUnit>;

export const EntryLifetime = z.object({
  value: z.number(),
  unit: EntryLifetimeUnit,
});
export type EntryLifetime = z.infer<typeof EntryLifetime>;
