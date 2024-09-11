import { ActionIcon, Box, Checkbox, Divider, Group, Text } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconStar, IconTrash } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { FixedSizeList } from "react-window";

import { pageAtom } from "~popup/state/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { Page } from "~types/page";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { EntryRow } from "./EntryRow";
import { LockEntriesActionIcon } from "./LockEntriesActionIcon";
import { UnlockEntriesActionIcon } from "./UnlockEntriesActionIcon";

interface Props {
  now: Date;
  entries: Entry[];
  favoriteEntryIdsSet: Set<string>;
}

export const EntryList = ({ now, entries, favoriteEntryIdsSet }: Props) => {
  const page = useAtomValue(pageAtom);

  const selectedEntryIds = useSet<string>();
  const entryIdsStringified = useMemo(() => JSON.stringify(entries.map(({ id }) => id)), [entries]);

  useEffect(() => {
    selectedEntryIds.clear();
  }, [entryIdsStringified]);

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
            {page === Page.Locked ? (
              <UnlockEntriesActionIcon
                entryIds={Array.from(selectedEntryIds)}
                disabled={selectedEntryIds.size === 0}
              />
            ) : (
              <LockEntriesActionIcon
                entryIds={Array.from(selectedEntryIds)}
                disabled={selectedEntryIds.size === 0}
              />
            )}
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
      <FixedSizeList height={500} itemCount={entries.length} itemSize={37} width={700}>
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
    </>
  );
};
