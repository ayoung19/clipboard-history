import { Storage } from "@plasmohq/storage";

import { VERSION } from "~utils/version";

const storage = new Storage({
  area: "local",
});

// Do not change this without a migration.
const CHANGELOG_VIEWED_AT_STORAGE_KEY = "changelogViewedAt";

export const getChangelogViewedAt = async () => {
  const changelogViewedAt = await storage.get<string>(CHANGELOG_VIEWED_AT_STORAGE_KEY);
  if (changelogViewedAt === undefined) {
    return null;
  }

  return changelogViewedAt;
};

export const updateChangelogViewedAt = async () => {
  await storage.set(CHANGELOG_VIEWED_AT_STORAGE_KEY, VERSION);
};
