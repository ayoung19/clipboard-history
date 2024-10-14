import { ActionIcon, Group, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import {
  entryIdToTagsAtom,
  favoriteEntryIdsSetAtom,
  reversedEntriesAtom,
  searchAtom,
} from "~popup/states/atoms";
import { commonActionIconSx } from "~utils/sx";

export const FavoritesPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  return (
    <EntryList
      noEntriesOverlay={
        search.length === 0 ? (
          <NoEntriesOverlay
            title="You have no favorite items"
            subtitle={
              <Group align="center" spacing={0}>
                Mark an item as favorite by clicking on
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
