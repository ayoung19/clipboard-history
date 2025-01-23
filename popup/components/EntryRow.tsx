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
import { modals } from "@mantine/modals";
import { IconEdit } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";

import { clipboardSnapshotAtom, entryIdToTagsAtom, nowAtom } from "~popup/states/atoms";
import { updateClipboardSnapshot } from "~storage/clipboardSnapshot";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { commonActionIconSx, defaultBorderColor, lightOrDark } from "~utils/sx";

import { EntryDeleteAction } from "./EntryDeleteAction";
import { EntryFavoriteAction } from "./EntryFavoriteAction";
import { EditEntryModalContent } from "./modals/EditEntryModalContent";
import { TagBadge } from "./TagBadge";
import { TagSelect } from "./TagSelect";

interface Props {
  entry: Entry;
  selectedEntryIds: Set<string>;
}

export const EntryRow = ({ entry, selectedEntryIds }: Props) => {
  const theme = useMantineTheme();
  const now = useAtomValue(nowAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);
  const [clipboardSnapshot, setClipboardSnapshot] = useAtom(clipboardSnapshotAtom);

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
        <Text ff="monospace" color="dimmed" fz={10} ml="xs" sx={{ userSelect: "none" }}>
          {entry.content.length}
        </Text>
        <Group align="center" spacing={0} noWrap ml={rem(4)}>
          <TagSelect entryId={entry.id} />
          <ActionIcon
            sx={(theme) => commonActionIconSx({ theme })}
            onClick={(e) => {
              e.stopPropagation();

              modals.open({
                padding: 0,
                size: "xl",
                withCloseButton: false,
                children: <EditEntryModalContent entry={entry} />,
              });
            }}
          >
            <IconEdit size="1rem" />
          </ActionIcon>
          <EntryFavoriteAction entryId={entry.id} />
          <EntryDeleteAction entryId={entry.id} />
        </Group>
      </Group>
      <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
    </Stack>
  );
};
