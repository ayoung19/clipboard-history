import { createHash } from "crypto";
import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  rem,
  Text,
  Transition,
} from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconClipboard, IconFold, IconStar, IconTrash } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { createRef, useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import { FixedSizeList } from "react-window";

import { clipboardSnapshotAtom, favoriteEntryIdsSetAtom } from "~popup/states/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx, defaultBorderColor } from "~utils/sx";

import { EntryRow, type EntryRowProps } from "./EntryRow";
import { MergeModalContent } from "./modals/MergeModalContent";

interface EntryRowRendererData extends Omit<EntryRowProps, "entry"> {
  entries: Entry[];
}

const EntryRowRenderer = ({
  data,
  index,
  style,
}: {
  data: EntryRowRendererData;
  index: number;
  style: CSSProperties;
}) => {
  const entry = data.entries[index]!;

  return (
    <Box style={style}>
      <EntryRow
        entry={entry}
        selectedEntryIds={data.selectedEntryIds}
        visibleEntryIds={data.visibleEntryIds}
      />
    </Box>
  );
};

interface Props {
  entries: Entry[];
  noEntriesOverlay: ReactNode;
}

export const EntryList = ({ entries, noEntriesOverlay }: Props) => {
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const clipboardSnapshot = useAtomValue(clipboardSnapshotAtom);
  const clipboardSnapshotContentId = useMemo(
    () => clipboardSnapshot && createHash("sha256").update(clipboardSnapshot.content).digest("hex"),
    [clipboardSnapshot?.content],
  );

  const selectedEntryIds = useSet<string>();
  const visibleEntryIds = useSet<string>();
  const entryIdsStringified = useMemo(() => JSON.stringify(entries.map(({ id }) => id)), [entries]);

  const listRef = createRef<FixedSizeList<EntryRowRendererData>>();

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
            {/* https://github.com/clauderic/dnd-kit/issues/1043 */}
            {process.env.PLASMO_TARGET !== "firefox-mv2" && (
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
                          children: (
                            <MergeModalContent
                              initialEntries={entries.filter((entry) =>
                                selectedEntryIds.has(entry.id),
                              )}
                            />
                          ),
                        })
                }
              >
                <IconFold size="1rem" />
              </ActionIcon>
            )}
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
        // Used by IntersectionObserver in EntryRow.
        <Box id="entry-list-wrapper">
          <FixedSizeList
            ref={listRef}
            height={450}
            width={700}
            itemData={{ entries, selectedEntryIds, visibleEntryIds }}
            itemCount={entries.length}
            itemSize={33}
          >
            {EntryRowRenderer}
          </FixedSizeList>
        </Box>
      )}
      <Affix position={{ bottom: rem(24), right: rem(24) }}>
        <Transition
          transition="fade"
          mounted={
            !!clipboardSnapshotContentId &&
            entries.some((entry) => entry.id === clipboardSnapshotContentId) &&
            visibleEntryIds.size > 0 &&
            !visibleEntryIds.has(clipboardSnapshotContentId)
          }
        >
          {/* {(transitionStyles) => (
            <Button
              variant="default"
              style={transitionStyles}
              px={rem(9)}
              sx={(theme) => ({ boxShadow: theme.shadows.xl })}
              onClick={() => {
                const index = entries.findIndex(
                  (entry) => entry.content === clipboardSnapshot?.content,
                );

                if (index >= 0) {
                  listRef.current?.scrollToItem(index);
                }
              }}
            >
              <IconArrowDown size="1rem" />
            </Button>
          )} */}
          {(transitionStyles) => (
            <Button
              variant="default"
              leftIcon={<IconClipboard size="1rem" />}
              style={transitionStyles}
              sx={(theme) => ({ boxShadow: theme.shadows.xl })}
              onClick={() => {
                const index = entries.findIndex(
                  (entry) => entry.content === clipboardSnapshot?.content,
                );

                if (index >= 0) {
                  listRef.current?.scrollToItem(index);
                }
              }}
            >
              Go to copied item
            </Button>
          )}
        </Transition>
      </Affix>
    </Box>
  );
};
