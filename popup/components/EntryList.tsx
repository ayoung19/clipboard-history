import { ActionIcon, Box, Checkbox, Divider, Group, Text } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconStar, IconTrash } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import { FixedSizeList } from "react-window";

import { favoriteEntryIdsSetAtom } from "~popup/states/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx, defaultBorderColor } from "~utils/sx";

import { EntryRow } from "./EntryRow";

interface Props {
  entries: Entry[];
  noEntriesOverlay: ReactNode;
}

const EntryRowRenderer = ({
  data,
  index,
  style,
}: {
  data: {
    entries: Entry[];
    selectedEntryIds: Set<string>;
  };
  index: number;
  style: CSSProperties;
}) => {
  const entry = data.entries[index]!;

  return (
    <Box style={style}>
      <EntryRow key={entry.id} entry={entry} selectedEntryIds={data.selectedEntryIds} />
    </Box>
  );
};

export const EntryList = ({ entries, noEntriesOverlay }: Props) => {
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);

  const selectedEntryIds = useSet<string>();
  const entryIdsStringified = useMemo(() => JSON.stringify(entries.map(({ id }) => id)), [entries]);

  useEffect(() => {
    selectedEntryIds.clear();
  }, [entryIdsStringified]);

  return (
    <Box
      sx={(theme) => ({
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: defaultBorderColor(theme),
        borderRadius: theme.radius.sm,
      })}
    >
      <Group align="center" spacing="sm" noWrap px="sm" h={32}>
        <Checkbox
          size="xs"
          sx={(theme) => ({
            ".mantine-Checkbox-input:hover": {
              borderColor: theme.fn.primaryColor(),
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
              onClick={() =>
                deleteEntries(
                  Array.from(selectedEntryIds).filter(
                    (selectedEntryId) => !favoriteEntryIdsSet.has(selectedEntryId),
                  ),
                )
              }
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
          <Text fz="xs">
            {selectedEntryIds.size} of {entries.length} selected
          </Text>
        </Group>
      </Group>
      <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
      {entries.length === 0 ? (
        <Box h={450} w={700}>
          {noEntriesOverlay}
        </Box>
      ) : (
        <FixedSizeList
          height={450}
          width={700}
          itemData={{ entries, selectedEntryIds }}
          itemCount={entries.length}
          itemSize={33}
        >
          {EntryRowRenderer}
        </FixedSizeList>
      )}
    </Box>
  );
};
