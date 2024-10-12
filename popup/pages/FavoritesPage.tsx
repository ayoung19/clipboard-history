import { Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import NoEntriesOverlay from "~popup/components/NoEntriesOverlay";
import {
  entryIdToTagsAtom,
  favoriteEntryIdsSetAtom,
  reversedEntriesAtom,
  searchAtom,
} from "~popup/states/atoms";

export const FavoritesPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  return (
    <EntryList
      noEntriesOverlay={NoEntriesOverlay(
        "Your favourites are empty",
        <Text size="sm" color="dimmed">
          Mark an entry as favourite by clicking on the{" "}
          {<IconStar style={{ verticalAlign: "middle" }} size="1rem" />} icon
        </Text>,
      )}
      entries={reversedEntries.filter(
        (entry) =>
          favoriteEntryIdsSet.has(entry.id) &&
          (search.length === 0 ||
            entry.content.toLowerCase().includes(search.toLowerCase()) ||
            entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase()))),
      )}
    />
  );
};
