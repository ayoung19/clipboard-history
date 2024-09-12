import {
  ActionIcon,
  Badge,
  Checkbox,
  Divider,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useClipboard, useHover } from "@mantine/hooks";
import { IconCheck, IconCopy, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useAtom } from "jotai";

import { clipboardContentAtom } from "~popup/states/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  now: Date;
  entry: Entry;
  selectedEntryIds: Set<string>;
  favoriteEntryIdsSet: Set<string>;
}

export const EntryRow = ({ now, entry, selectedEntryIds, favoriteEntryIdsSet }: Props) => {
  const { copied, copy } = useClipboard({ timeout: 500 });

  const [clipboardContent, setClipboardContent] = useAtom(clipboardContentAtom);

  const isFavoriteEntry = favoriteEntryIdsSet.has(entry.id);

  return (
    <Stack
      spacing={0}
      sx={(theme) => ({
        backgroundColor: selectedEntryIds.has(entry.id) ? theme.colors.indigo[0] : undefined,
        cursor: "pointer",
        ".visible-on-row-hover": {
          visibility: "hidden",
        },
        ":hover": {
          backgroundColor: selectedEntryIds.has(entry.id)
            ? theme.colors.indigo[0]
            : theme.colors.gray[0],
          ".visible-on-row-hover": {
            visibility: "visible",
          },
        },
      })}
      onClick={() => {
        copy(entry.content);
        setClipboardContent(entry.content);
      }}
    >
      <Group align="center" spacing={0} noWrap px="md" py={4}>
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
          checked={selectedEntryIds.has(entry.id)}
          onChange={() =>
            selectedEntryIds.has(entry.id)
              ? selectedEntryIds.delete(entry.id)
              : selectedEntryIds.add(entry.id)
          }
          onClick={(e) => e.stopPropagation()}
        />
        <Badge color={"gray.5"} variant="filled" w={100} sx={{ flexShrink: 0 }} size="md" mx="md">
          {badgeDateFormatter(now, new Date(entry.createdAt))}
        </Badge>
        <Text
          fz="xs"
          color="gray.8"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {entry.content}
        </Text>
        <Group align="center" spacing={0} noWrap>
          <ActionIcon
            sx={(theme) => ({
              color: copied ? theme.colors.green[4] : theme.colors.gray[5],
              ":hover": {
                color: copied ? theme.colors.green[4] : theme.colors.gray[5],
                backgroundColor: "inherit",
              },
              ":active": {
                transform: "none",
              },
            })}
            className="visible-on-row-hover"
          >
            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
          </ActionIcon>
          <ActionIcon
            sx={(theme) => ({
              color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[5],
              ":hover": {
                color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[7],
                backgroundColor: theme.colors.indigo[1],
              },
            })}
            onClick={(e) => {
              e.stopPropagation();

              isFavoriteEntry
                ? deleteFavoriteEntryIds([entry.id])
                : addFavoriteEntryIds([entry.id]);
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
      <Divider color="gray.2" />
    </Stack>
  );
};
