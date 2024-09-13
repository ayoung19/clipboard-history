import { ActionIcon, Badge, Checkbox, Divider, Group, Stack, Text } from "@mantine/core";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";

import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  now: Date;
  entry: Entry;
  clipboardContent?: string;
  selectedEntryIds: Set<string>;
  favoriteEntryIdsSet: Set<string>;
  onEntryClick: (entry: Entry) => void;
}

export const EntryRow = ({
  now,
  entry,
  clipboardContent,
  selectedEntryIds,
  favoriteEntryIdsSet,
  onEntryClick,
}: Props) => {
  const isFavoriteEntry = favoriteEntryIdsSet.has(entry.id);

  return (
    <Stack
      key={entry.id}
      spacing={0}
      sx={(theme) => ({
        backgroundColor: selectedEntryIds.has(entry.id) ? theme.colors.indigo[0] : undefined,
        cursor: "pointer",
        ":hover": {
          backgroundColor: selectedEntryIds.has(entry.id)
            ? theme.colors.indigo[0]
            : theme.colors.gray[0],
        },
      })}
      onClick={() => onEntryClick(entry)}
    >
      <Group align="center" spacing="sm" noWrap px="sm" h={32}>
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
        <Badge
          color={entry.content === clipboardContent ? "indigo.3" : "gray.5"}
          variant="filled"
          w={100}
          sx={{ flexShrink: 0 }}
          size="sm"
        >
          {entry.content === clipboardContent
            ? "Copied"
            : badgeDateFormatter(now, new Date(entry.createdAt))}
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
      <Divider color="gray.3" />
    </Stack>
  );
};
