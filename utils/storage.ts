import { createHash } from "crypto";
import { z } from "zod";

import { Storage } from "@plasmohq/storage";

import { Entry } from "~types/entry";

const storage = new Storage({
  area: "local",
});

export const getEntries = async () => {
  const entries = await storage.get("entries");
  const parsed = z.array(Entry).safeParse(entries);
  if (parsed.success) {
    return parsed.data;
  }

  await setEntries([]);

  return [];
};

export const setEntries = async (entries: Entry[]) =>
  storage.set("entries", JSON.stringify(entries));

export const createEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  if (!!(await storage.get(entryId))) {
    return;
  }

  const entries = await getEntries();
  await setEntries([
    ...entries,
    {
      id: entryId,
      createdAt: new Date().getTime(),
      content,
    },
  ]);

  await storage.set(entryId, "1");
};

export const deleteEntry = async (content: string) => {
  const entryId = createHash("sha256").update(content).digest("hex");

  const entries = await getEntries();
  await setEntries(entries.filter(({ id }) => id !== entryId));

  await storage.set(entryId, "");
};
