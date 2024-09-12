import { createHash } from "crypto";

import { Storage } from "@plasmohq/storage";

import { Entry } from "~types/entry";

const storage = new Storage({
  area: "local",
});

export const watchEntries = (cb: (entries: Entry[]) => void) => {
  return storage.watch({
    entries: (c) => {
      if (c.newValue === undefined) {
        cb([]);
      } else {
        cb(c.newValue as Entry[]);
      }
    },
  });
};

export const getEntries = async () => {
  const entries = await storage.get<Entry[]>("entries");
  if (entries === undefined) {
    return [];
  }

  return entries;
};

export const setEntries = async (entries: Entry[]) => storage.set("entries", entries);

export const createEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  const entries = await getEntries();
  await setEntries([
    ...entries.filter(({ id }) => id !== entryId),
    {
      id: entryId,
      createdAt: new Date().getTime(),
      content,
    },
  ]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const entryIdSet = new Set(entryIds);
  const entries = await getEntries();
  await setEntries(entries.filter(({ id }) => !entryIdSet.has(id)));
};
