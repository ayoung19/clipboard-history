import { Stack, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
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

  const renderNoEntriesOverlay = () => {
    return (
      <Stack h={450} w={700} justify="center" align="center">
        {search.length !== 0 ? (
          <>
            <Text size="xl" color="dimmed">
              No matches found for "{search}"
            </Text>
          </>
        ) : (
          <>
            <Text size="xl" color="dimmed">
              Your favourites are empty
            </Text>
            <Text size="sm" color="dimmed">
              Mark an entry as favourite by clicking on the{" "}
              {<IconStar style={{ verticalAlign: "middle" }} size="1rem" />} icon
            </Text>
          </>
        )}
      </Stack>
    );
  };

  return (
    <EntryList
      noEntriesOverlay={renderNoEntriesOverlay()}
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
