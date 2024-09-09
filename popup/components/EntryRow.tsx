import { ActionIcon, Badge, Box, Checkbox, Divider, Group, Stack, Text } from "@mantine/core";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";

import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entry: Entry;
  clipboardContent?: string;
  selectedEntryIds: Set<string>;
  favoriteEntryIdsSet: Set<string>;
  onEntryClick: (entry: Entry) => void;
}

export const EntryRow = ({
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
        <Box w={150} mx="md">
          <Badge
            color={entry.content === clipboardContent ? "indigo.4" : "gray.5"}
            variant="filled"
            fullWidth
          >
            {entry.content === clipboardContent
              ? "Copied"
              : badgeDateFormatter(new Date(entry.createdAt))}
          </Badge>
        </Box>

        <Text
          fz="xs"
          color="gray.8"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
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
      <Divider color="gray.2" />
    </Stack>
  );
};
