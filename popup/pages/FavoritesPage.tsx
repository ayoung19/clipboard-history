import { Group, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { CommonActionIcon } from "~popup/components/CommonActionIcon";
import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { searchAtom } from "~popup/states/atoms";

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
            title={chrome.i18n.getMessage("overlayNoFavoritesTitle")}
            subtitle={
              <Group align="center" spacing={0}>
                <Text>{chrome.i18n.getMessage("overlayNoFavoritesSubtitlePrefix")}</Text>
                <CommonActionIcon>
                  <IconStar size="1rem" />
                </CommonActionIcon>
              </Group>
            }
            description={chrome.i18n.getMessage("overlayNoFavoritesDescription")}
          />
        ) : (
          <NoEntriesOverlay title={chrome.i18n.getMessage("overlayNoResultsTitle", [search])} />
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
