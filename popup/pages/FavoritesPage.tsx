import { ActionIcon, Group, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { searchAtom } from "~popup/states/atoms";
import { commonActionIconSx } from "~utils/sx";

export const FavoritesPage = () => {
  const reversedEntries = useEntries();
  const favoriteEntryIdsSet = useFavoriteEntryIds();
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useEntryIdToTags();

  return (
    <EntryList
      noEntriesOverlay={
        search.length === 0 ? (
          <NoEntriesOverlay
            title="You have no favorite items"
            subtitle={
              <Group align="center" spacing={0}>
                <Text>Mark an item as favorite by clicking on</Text>
                <ActionIcon sx={(theme) => commonActionIconSx({ theme })}>
                  <IconStar size="1rem" />
                </ActionIcon>
              </Group>
            }
            description="Favorite items are protected from deletion"
          />
        ) : (
          <NoEntriesOverlay title={`No items found for "${search}"`} />
        )
      }
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
