import { ActionIcon, Box, Checkbox, Divider, Group } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconStar, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { FixedSizeList } from "react-window";

import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { EntryRow } from "./EntryRow";

interface Props {
  entries: Entry[];
  clipboardContent?: string;
  favoriteEntryIdsSet: Set<string>;
  onEntryClick: (entry: Entry) => void;
}

export const EntryList = ({
  entries,
  clipboardContent,
  favoriteEntryIdsSet,
  onEntryClick,
}: Props) => {
  const selectedEntryIds = useSet<string>();

  useEffect(() => {
    selectedEntryIds.clear();
  }, [entries]);

  return (
    <>
      <Group align="center" spacing="md" noWrap px="md" py={4}>
        <Checkbox
          size="xs"
          color="indigo.3"
          sx={(theme) => ({
            ".mantine-Checkbox-input": {
              cursor: "pointer",
              "&:hover": {
                borderColor: theme.colors.indigo[3],
              },
            },
          })}
          checked={selectedEntryIds.size > 0 && selectedEntryIds.size === entries.length}
          indeterminate={selectedEntryIds.size > 0 && selectedEntryIds.size < entries.length}
          onChange={() =>
            selectedEntryIds.size === 0
              ? entries.forEach((entry) => selectedEntryIds.add(entry.id))
              : selectedEntryIds.clear()
          }
        />
        <Group spacing={0}>
          <ActionIcon
            sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size === 0 })}
            onClick={() =>
              Array.from(selectedEntryIds).every((selectedEntryId) =>
                favoriteEntryIdsSet.has(selectedEntryId),
              )
                ? deleteFavoriteEntryIds(Array.from(selectedEntryIds))
                : addFavoriteEntryIds(Array.from(selectedEntryIds))
            }
          >
            <IconStar size="1rem" />
          </ActionIcon>
          <ActionIcon
            sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size === 0 })}
            onClick={async () => {
              await deleteEntries(
                Array.from(selectedEntryIds).filter(
                  (selectedEntryId) => !favoriteEntryIdsSet.has(selectedEntryId),
                ),
              );

              selectedEntryIds.clear();
            }}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Group>
      <Divider color="gray.2" />
      <FixedSizeList height={500} itemCount={entries.length} itemSize={37} width={700}>
        {({ index, style }) => (
          <Box style={style}>
            <EntryRow
              entry={entries[index]!}
              clipboardContent={clipboardContent}
              selectedEntryIds={selectedEntryIds}
              favoriteEntryIdsSet={favoriteEntryIdsSet}
              onEntryClick={onEntryClick}
            />
          </Box>
        )}
      </FixedSizeList>
    </>
  );
};
