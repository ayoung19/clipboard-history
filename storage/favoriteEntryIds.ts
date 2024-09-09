import { z } from "zod";

import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

export const watchFavoriteEntryIds = (cb: (entryIds: string[]) => void) => {
  return storage.watch({
    favoriteEntryIds: (c) => {
      const parsed = z.array(z.string()).safeParse(c.newValue);

      if (parsed.success) {
        cb(parsed.data);
        return;
      }

      setFavoriteEntryIds([]);

      cb([]);
    },
  });
};

export const getFavoriteEntryIds = async () => {
  const entries = await storage.get("favoriteEntryIds");
  const parsed = z.array(z.string()).safeParse(entries);

  if (parsed.success) {
    return parsed.data;
  }

  await setFavoriteEntryIds([]);

  return [];
};

export const setFavoriteEntryIds = async (entryIds: string[]) =>
  storage.set("favoriteEntryIds", entryIds);

export const addFavoriteEntryIds = async (entryIds: string[]) => {
  const favoriteEntryIds = await getFavoriteEntryIds();
  await setFavoriteEntryIds(Array.from(new Set([...favoriteEntryIds, ...entryIds])));
};

export const deleteFavoriteEntryIds = async (entryIds: string[]) => {
  const s = new Set(entryIds);

  const favoriteEntryIds = await getFavoriteEntryIds();
  await setFavoriteEntryIds(favoriteEntryIds.filter((favoriteEntryId) => !s.has(favoriteEntryId)));
};
