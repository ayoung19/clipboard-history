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
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          height: 450,
          width: 700,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {search.length !== 0 ? (
          <>
            <Text size="xl" style={{ color: "#a1a1a1" }}>
              No matches found for "{search}"
            </Text>
          </>
        ) : (
          <>
            <Text size="xl" style={{ color: "#a1a1a1" }}>
              Your favourites are empty
            </Text>
            <Text size="sm" c="gray">
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
