import { ActionIcon, Box, Checkbox, Divider, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconFold, IconKeyboard, IconStar, IconTrash } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ShortcutsModalContent } from "~popup/components/modals/ShortcutsModalContent";
import { favoriteEntryIdsSetAtom, shortcutsAtom } from "~popup/states/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import type { CommandNameToShortcut } from "~types/shortcut";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx, defaultBorderColor } from "~utils/sx";

import { EntryRow } from "./EntryRow";
import { MergeModalContent } from "./modals/MergeModalContent";

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
    shortcuts: CommandNameToShortcut;
  };
  index: number;
  style: CSSProperties;
}) => {
  const entry = data.entries[index]!;

  return (
    <Box style={style}>
      <EntryRow entry={entry} selectedEntryIds={data.selectedEntryIds} shortcuts={data.shortcuts} />
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

  const shortcuts = useAtomValue(shortcutsAtom);

  const getSelectedEntries = () => entries.filter((entry) => selectedEntryIds.has(entry.id));

  return (
    <Stack
      h="100%"
      spacing={0}
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
            <Tooltip label={<Text fz="xs">Favorite</Text>} disabled={selectedEntryIds.size === 0}>
              <ActionIcon
                sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size === 0 })}
                onClick={
                  selectedEntryIds.size === 0
                    ? undefined
                    : () =>
                        Array.from(selectedEntryIds).every((selectedEntryId) =>
                          favoriteEntryIdsSet.has(selectedEntryId),
                        )
                          ? deleteFavoriteEntryIds(Array.from(selectedEntryIds))
                          : addFavoriteEntryIds(Array.from(selectedEntryIds))
                }
              >
                <IconStar size="1rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={<Text fz="xs">Delete</Text>} disabled={selectedEntryIds.size === 0}>
              <ActionIcon
                sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size === 0 })}
                onClick={
                  selectedEntryIds.size === 0
                    ? undefined
                    : () =>
                        deleteEntries(
                          Array.from(selectedEntryIds).filter(
                            (selectedEntryId) => !favoriteEntryIdsSet.has(selectedEntryId),
                          ),
                        )
                }
              >
                <IconTrash size="1rem" />
              </ActionIcon>
            </Tooltip>
            {/* https://github.com/clauderic/dnd-kit/issues/1043 */}
            {process.env.PLASMO_TARGET !== "firefox-mv2" && (
              <Tooltip label={<Text fz="xs">Merge</Text>} disabled={selectedEntryIds.size < 2}>
                <ActionIcon
                  sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size < 2 })}
                  onClick={
                    selectedEntryIds.size < 2
                      ? undefined
                      : () =>
                          modals.open({
                            padding: 0,
                            size: "xl",
                            withCloseButton: false,
                            children: <MergeModalContent initialEntries={getSelectedEntries()} />,
                          })
                  }
                >
                  <IconFold size="1rem" />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label={<Text fz="xs">Shortcuts</Text>} disabled={selectedEntryIds.size !== 1}>
              <ActionIcon
                sx={(theme) => commonActionIconSx({ theme, disabled: selectedEntryIds.size !== 1 })}
                onClick={() => {
                  if (selectedEntryIds.size !== 1) return;

                  const [selectedEntry] = getSelectedEntries();
                  if (!selectedEntry) return;

                  modals.open({
                    padding: 0,
                    size: "xl",
                    withCloseButton: false,
                    children: <ShortcutsModalContent selectedEntry={selectedEntry} />,
                  });
                }}
              >
                <IconKeyboard size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Text fz="xs">
            {selectedEntryIds.size} of {entries.length} selected
          </Text>
        </Group>
      </Group>
      <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
      <Box sx={{ flex: "auto" }}>
        {entries.length === 0 ? (
          noEntriesOverlay
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemData={{ entries, selectedEntryIds, shortcuts }}
                itemCount={entries.length}
                itemSize={33}
              >
                {EntryRowRenderer}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </Box>
    </Stack>
  );
};
