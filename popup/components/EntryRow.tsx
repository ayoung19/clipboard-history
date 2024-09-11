import { ActionIcon, Badge, Checkbox, Divider, Group, Stack, Text } from "@mantine/core";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";

import { clipboardContentAtom, keyAtom } from "~popup/state/atoms";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { decryptEntry } from "~utils/crypto";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { LockEntriesActionIcon } from "./LockEntriesActionIcon";
import { UnlockEntriesActionIcon } from "./UnlockEntriesActionIcon";

interface Props {
  now: Date;
  entry: Entry;
  selectedEntryIds: Set<string>;
  favoriteEntryIdsSet: Set<string>;
}

export const EntryRow = ({ now, entry, selectedEntryIds, favoriteEntryIdsSet }: Props) => {
  const key = useAtomValue(keyAtom);

  const [clipboardContent, setClipboardContent] = useAtom(clipboardContentAtom);

  const isFavoriteEntry = favoriteEntryIdsSet.has(entry.id);

  const normalizedEntryContent = (
    entry.cryptoInfo === undefined || key === undefined ? entry : decryptEntry(key, entry)
  ).content;

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
      onClick={async () => {
        await navigator.clipboard.writeText(normalizedEntryContent);

        setClipboardContent(normalizedEntryContent);
      }}
    >
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
          checked={selectedEntryIds.has(entry.id)}
          onChange={() =>
            selectedEntryIds.has(entry.id)
              ? selectedEntryIds.delete(entry.id)
              : selectedEntryIds.add(entry.id)
          }
          onClick={(e) => e.stopPropagation()}
        />
        <Badge
          color={normalizedEntryContent === clipboardContent ? "indigo.4" : "gray.5"}
          variant="filled"
          w={100}
          sx={{ flexShrink: 0 }}
        >
          {normalizedEntryContent === clipboardContent
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
          {normalizedEntryContent}
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
          {entry.cryptoInfo === undefined ? (
            <LockEntriesActionIcon entryIds={[entry.id]} />
          ) : (
            <UnlockEntriesActionIcon entryIds={[entry.id]} />
          )}
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
