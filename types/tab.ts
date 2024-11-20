import { z } from "zod";

export const Tab = z.enum(["All", "Favorites"]);
export type Tab = z.infer<typeof Tab>;
