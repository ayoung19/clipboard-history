import { ActionIcon, Badge, Box, Checkbox, Divider, Group, Text } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconStar, IconTrash } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { FixedSizeList } from "react-window";

import { clipboardContentAtom } from "~popup/states/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { EntryRow } from "./EntryRow";

interface Props {
  now: Date;
  entries: Entry[];
  favoriteEntryIdsSet: Set<string>;
}

export const EntryList = ({ now, entries, favoriteEntryIdsSet }: Props) => {
  const selectedEntryIds = useSet<string>();
  const entryIdsStringified = useMemo(() => JSON.stringify(entries.map(({ id }) => id)), [entries]);

  const [clipboardContent, setClipboardContent] = useAtom(clipboardContentAtom);

  useEffect(() => {
    selectedEntryIds.clear();
  }, [entryIdsStringified]);

  return (
    <>
      <Group
        align="center"
        spacing="md"
        noWrap
        px="md"
        py={4}
        sx={(theme) => ({
          borderLeftColor: theme.colors.gray[2],
          borderRightColor: theme.colors.gray[2],
          borderLeftStyle: "solid",
          borderRightStyle: "solid",
          borderLeftWidth: "1px",
          borderRightWidth: "1px",
        })}
      >
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
        <Group align="center" w="100%" position="apart">
          <Group align="center" spacing={0}>
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
          <Text fz="xs" color="gray.8">
            {selectedEntryIds.size} of {entries.length} selected
          </Text>
        </Group>
      </Group>
      <Divider color="gray.2" />
      <Box
        sx={(theme) => ({
          borderLeftColor: theme.colors.gray[2],
          borderBottomColor: theme.colors.gray[2],
          borderLeftStyle: "solid",
          borderBottomStyle: "solid",
          borderLeftWidth: "1px",
          borderBottomWidth: "1px",
          borderRightColor: theme.colors.gray[2],
          borderRightStyle: "solid",
          borderRightWidth: "1px",
        })}
      >
        <FixedSizeList height={450} itemCount={entries.length} itemSize={37} width={700}>
          {({ index, style }) => (
            <Box style={style}>
              <EntryRow
                now={now}
                entry={entries[index]!}
                selectedEntryIds={selectedEntryIds}
                favoriteEntryIdsSet={favoriteEntryIdsSet}
              />
            </Box>
          )}
        </FixedSizeList>
      </Box>
    </>
  );
};
