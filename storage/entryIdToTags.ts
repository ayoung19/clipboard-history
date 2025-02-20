import { Storage } from "@plasmohq/storage";

import { EntryIdToTags } from "~types/entryIdToTags";

// Do not change this without a migration.
const ENTRY_ID_TO_TAGS_STORAGE_KEY = "entryIdToTags";

const storage = new Storage({
  area: "local",
});

export const watchEntryIdToTags = (cb: (entryIdToTags: EntryIdToTags) => void) => {
  return storage.watch({
    [ENTRY_ID_TO_TAGS_STORAGE_KEY]: (c) => {
      const parsed = EntryIdToTags.safeParse(c.newValue);

      cb(parsed.success ? parsed.data : {});
    },
  });
};

export const getEntryIdToTags = async () => {
  const parsed = EntryIdToTags.safeParse(
    await storage.get<EntryIdToTags>(ENTRY_ID_TO_TAGS_STORAGE_KEY),
  );

  return parsed.success ? parsed.data : {};
};

// Make sure tags are always unique and lowercase.
export const setEntryIdToTags = async (entryIdToTags: EntryIdToTags) => {
  await storage.set(ENTRY_ID_TO_TAGS_STORAGE_KEY, entryIdToTags);
};

export const deleteEntryIdsFromEntryIdToTags = async (entryIds: string[]) => {
  const entryIdToTags = await getEntryIdToTags();

  entryIds.forEach((entryId) => delete entryIdToTags[entryId]);

  await setEntryIdToTags(entryIdToTags);
};
