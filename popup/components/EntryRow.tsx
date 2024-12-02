import {
  ActionIcon,
  Badge,
  Checkbox,
  Divider,
  Group,
  rem,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";

import {
  clipboardSnapshotAtom,
  entryIdToTagsAtom,
  favoriteEntryIdsSetAtom,
  nowAtom,
} from "~popup/states/atoms";
import { updateClipboardSnapshot } from "~storage/clipboardSnapshot";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx, defaultBorderColor, lightOrDark } from "~utils/sx";

import { TagBadge } from "./TagBadge";
import { TagSelect } from "./TagSelect";

interface Props {
  entry: Entry;
  selectedEntryIds: Set<string>;
}

export const EntryRow = ({ entry, selectedEntryIds }: Props) => {
  const theme = useMantineTheme();
  const now = useAtomValue(nowAtom);
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);
  const [clipboardSnapshot, setClipboardSnapshot] = useAtom(clipboardSnapshotAtom);

  const isFavoriteEntry = favoriteEntryIdsSet.has(entry.id);

  return (
    <Stack
      key={entry.id}
      spacing={0}
      sx={(theme) => ({
        backgroundColor: selectedEntryIds.has(entry.id)
          ? lightOrDark(theme, theme.colors.indigo[0], theme.fn.darken(theme.colors.indigo[9], 0.5))
          : undefined,
        cursor: "pointer",
        ":hover": {
          backgroundColor: selectedEntryIds.has(entry.id)
            ? lightOrDark(
                theme,
                theme.colors.indigo[0],
                theme.fn.darken(theme.colors.indigo[9], 0.5),
              )
            : lightOrDark(theme, theme.colors.gray[0], theme.colors.dark[5]),
        },
      })}
      onClick={async () => {
        // Optimistically update local state with arbitrary updatedAt.
        setClipboardSnapshot({ content: entry.content, updatedAt: 0 });

        await updateClipboardSnapshot(entry.content);
        navigator.clipboard.writeText(entry.content);
      }}
    >
      <Group align="center" spacing={0} noWrap px="sm" h={32}>
        <Checkbox
          size="xs"
          sx={(theme) => ({
            ".mantine-Checkbox-input:hover": {
              borderColor: theme.fn.primaryColor(),
            },
          })}
          checked={selectedEntryIds.has(entry.id)}
          onChange={() =>
            selectedEntryIds.has(entry.id)
              ? selectedEntryIds.delete(entry.id)
              : selectedEntryIds.add(entry.id)
          }
          onClick={(e) => e.stopPropagation()}
        />
        <Badge
          color={
            entry.content === clipboardSnapshot?.content
              ? undefined
              : lightOrDark(theme, "gray.5", "dark.4")
          }
          variant="filled"
          w={100}
          sx={{ flexShrink: 0 }}
          size="sm"
          mx="sm"
        >
          {entry.content === clipboardSnapshot?.content
            ? "Copied"
            : badgeDateFormatter(now, new Date(entry.createdAt))}
        </Badge>
        <Text
          fz="xs"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Don't fully render large content. */}
          {entry.content.slice(0, 1000)}
        </Text>
        <Group align="center" spacing={rem(4)} noWrap>
          {entryIdToTags[entry.id]?.toSorted().map((tag) => <TagBadge key={tag} tag={tag} />)}
        </Group>
        <Group align="center" spacing={0} noWrap ml={rem(4)}>
          <TagSelect entryId={entry.id} />
          <ActionIcon
            sx={(theme) => ({
              color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[5],
              ":hover": {
                color: isFavoriteEntry
                  ? theme.colors.yellow[5]
                  : lightOrDark(theme, theme.colors.gray[7], theme.colors.gray[3]),
                backgroundColor: lightOrDark(
                  theme,
                  theme.colors.indigo[1],
                  theme.fn.darken(theme.colors.indigo[9], 0.3),
                ),
              },
            })}
            onClick={(e) => {
              e.stopPropagation();

              if (isFavoriteEntry) {
                deleteFavoriteEntryIds([entry.id]);
              } else {
                addFavoriteEntryIds([entry.id]);
              }
            }}
          >
            {isFavoriteEntry ? <IconStarFilled size="1rem" /> : <IconStar size="1rem" />}
          </ActionIcon>
          <ActionIcon
            sx={(theme) => commonActionIconSx({ theme, disabled: isFavoriteEntry })}
            onClick={(e) => {
              e.stopPropagation();

              if (!isFavoriteEntry) {
                deleteEntries([entry.id]);
              }
            }}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Group>
      <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
    </Stack>
  );
};
