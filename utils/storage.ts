import { createHash } from "crypto";
import { z } from "zod";

import { Storage } from "@plasmohq/storage";

import { Entry } from "~types/entry";

import { decryptEntry, encryptEntry } from "./crypto";

const storage = new Storage({
  area: "local",
});
storage.setNamespace("entryIdSet");

export const watchEntries = (cb: (entries: Entry[]) => void) => {
  return storage.watch({
    entries: (c) => {
      const parsed = z.array(Entry).safeParse(c.newValue);

      if (parsed.success) {
        cb(parsed.data);
        return;
      }

      storage.removeAll();
      setEntries([]);

      cb([]);
    },
  });
};

export const getEntries = async () => {
  const entries = await storage.get("entries");
  const parsed = z.array(Entry).safeParse(entries);

  if (parsed.success) {
    return parsed.data;
  }

  await Promise.all([storage.removeAll(), setEntries([])]);

  return [];
};

export const setEntries = async (entries: Entry[]) => storage.set("entries", entries);

export const createEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  if (!!(await storage.get(storage.getNamespacedKey(entryId)))) {
    return;
  }

  const entries = await getEntries();
  await Promise.all([
    setEntries([
      ...entries,
      {
        id: entryId,
        createdAt: new Date().getTime(),
        content,
      },
    ]),
    storage.set(storage.getNamespacedKey(entryId), "1"),
  ]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const s = new Set(entryIds);
  const entries = await getEntries();
  await Promise.all([
    setEntries(entries.filter(({ id }) => !s.has(id))),
    storage.removeMany(entryIds.map((entryId) => storage.getNamespacedKey(entryId))),
  ]);
};

export const unlockEntries = async (entryIds: string[], key: string) => {
  const s = new Set(entryIds);
  const entries = await getEntries();
  await setEntries(entries.map((entry) => (s.has(entry.id) ? decryptEntry(key, entry) : entry)));
};

export const lockEntries = async (entryIds: string[], key: string) => {
  const s = new Set(entryIds);
  const entries = await getEntries();
  await setEntries(entries.map((entry) => (s.has(entry.id) ? encryptEntry(key, entry) : entry)));
};
