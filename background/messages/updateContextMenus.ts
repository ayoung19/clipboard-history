import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getEntryIdToTags } from "~storage/entryIdToTags";
import { getFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { entryIdToTagsToAllTags } from "~utils/entryIdToTags";
import { simplePathJoin } from "~utils/simplePath";
import { getEntries } from "~utils/storage";

export type UpdateContextMenusRequestBody = undefined;

// https://www.totaltypescript.com/the-empty-object-type-in-typescript#representing-an-empty-object
export type UpdateContextMenusResponseBody = Record<PropertyKey, never>;

export const handleUpdateContextMenusRequest = async () => {
  const [entries, favoriteEntryIds, entryIdToTags] = await Promise.all([
    getEntries(),
    getFavoriteEntryIds(),
    getEntryIdToTags(),
  ]);
  const reversedEntries = entries.toReversed();
  const favoriteEntryIdsSet = new Set(favoriteEntryIds);
  const favoriteEntries = reversedEntries.filter((entry) => favoriteEntryIdsSet.has(entry.id));
  const allTags = entryIdToTagsToAllTags(entryIdToTags).sort();

  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: simplePathJoin("paste"),
    title: "Paste from Clipboard History IO",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    parentId: simplePathJoin("paste"),
    id: simplePathJoin("paste", "all"),
    title: "📋 All",
    contexts: ["editable"],
    enabled: reversedEntries.length > 0,
  });

  chrome.contextMenus.create({
    parentId: simplePathJoin("paste"),
    id: simplePathJoin("paste", "favorites"),
    title: "⭐️ Favorites",
    contexts: ["editable"],
    enabled: favoriteEntries.length > 0,
  });

  chrome.contextMenus.create({
    parentId: simplePathJoin("paste"),
    id: simplePathJoin("paste", "tags"),
    title: "🏷 Tags",
    contexts: ["editable"],
    enabled: allTags.length > 0,
  });

  reversedEntries.slice(0, 20).forEach((entry) =>
    chrome.contextMenus.create({
      parentId: simplePathJoin("paste", "all"),
      id: simplePathJoin("paste", "all", entry.id),
      title: entry.content || " ",
      contexts: ["editable"],
    }),
  );

  favoriteEntries.slice(0, 40).forEach((entry) =>
    chrome.contextMenus.create({
      parentId: simplePathJoin("paste", "favorites"),
      id: simplePathJoin("paste", "favorites", entry.id),
      title: entry.content || " ",
      contexts: ["editable"],
    }),
  );

  allTags.forEach((tag) =>
    chrome.contextMenus.create({
      parentId: simplePathJoin("paste", "tags"),
      id: simplePathJoin("paste", "tags", tag),
      title: tag,
      contexts: ["editable"],
    }),
  );

  reversedEntries
    .filter((entry) => entry.id in entryIdToTags)
    .forEach((entry) =>
      entryIdToTags[entry.id]?.forEach((tag) =>
        chrome.contextMenus.create({
          parentId: simplePathJoin("paste", "tags", tag),
          id: simplePathJoin("paste", "tags", tag, entry.id),
          title: entry.content || " ",
          contexts: ["editable"],
        }),
      ),
    );
};

const handler: PlasmoMessaging.MessageHandler<
  UpdateContextMenusRequestBody,
  UpdateContextMenusResponseBody
> = async (_, res) => {
  await handleUpdateContextMenusRequest();

  res.send({});
};

export default handler;
