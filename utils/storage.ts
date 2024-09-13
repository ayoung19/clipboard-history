import { createHash } from "crypto";

import { Storage } from "@plasmohq/storage";

import { Entry } from "~types/entry";

import { setActionBadge } from "./actionBadge";

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
  const entries = await storage.get<Entry[]>("entryIdSetentries");
  if (entries === undefined) {
    return [];
  }

  return entries;
};

export const setEntries = async (entries: Entry[]) => storage.set("entryIdSetentries", entries);

export const createEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  const entries = await getEntries();
  const newEntries = [
    ...entries.filter(({ id }) => id !== entryId),
    {
      id: entryId,
      createdAt: Date.now(),
      content,
    },
  ];

  await Promise.all([setEntries(newEntries), setActionBadge(newEntries.length)]);
};

export const deleteEntries = async (entryIds: string[]) => {
  const entryIdSet = new Set(entryIds);

  const entries = await getEntries();
  const newEntries = entries.filter(({ id }) => !entryIdSet.has(id));

  await Promise.all([setEntries(newEntries), setActionBadge(newEntries.length)]);
};
