import {
  ActionIcon,
  Badge,
  Box,
  Checkbox,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconSearch, IconStar, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { getClipboardContent, watchClipboardContent } from "~storage/clipboardContent";
import {
  addFavoriteEntryIds,
  deleteFavoriteEntryIds,
  getFavoriteEntryIds,
  watchFavoriteEntryIds,
} from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { badgeDateFormatter } from "~utils/date";
import { deleteEntries, getEntries, watchEntries } from "~utils/storage";

import { EntryActions } from "./components/EntryActions";

export const App = () => {
  const [tab, setTab] = useState("all");

  const selectedEntryIds = useSet<string>();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [clipboardContent, setClipboardContent] = useState<string>();

  const [favoriteEntryIds, setFavoriteEntryIds] = useState<string[]>([]);
  const favoriteEntryIdsSet = useMemo(() => new Set(favoriteEntryIds), [favoriteEntryIds]);

  const reversedEntries = useMemo(() => entries.toReversed(), [entries]);

  useEffect(() => {
    (async () => setEntries(await getEntries()))();
    watchEntries(setEntries);

    (async () => setClipboardContent(await getClipboardContent()))();
    watchClipboardContent(setClipboardContent);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds(setFavoriteEntryIds);
  }, []);

  useEffect(() => {
    selectedEntryIds.clear();
  }, [entries]);

  return (
    <Box w={700}>
      <Group align="center" position="apart" px="md" py="xs">
        <Group align="center">
          <Switch size="md" color="indigo.4" />
          <TextInput placeholder="Search" icon={<IconSearch size="1rem" />} size="xs" />
        </Group>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          size="xs"
          data={[
            { label: "All", value: "all" },
            { label: "Favorites", value: "favorites" },
          ]}
        />
      </Group>
      <Divider color="gray.2" />
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
          checked={selectedEntryIds.size === entries.length}
          indeterminate={selectedEntryIds.size > 0 && selectedEntryIds.size < entries.length}
          onChange={() =>
            selectedEntryIds.size === 0
              ? entries.forEach((entry) => selectedEntryIds.add(entry.id))
              : selectedEntryIds.clear()
          }
        />
        <Group spacing={0}>
          <ActionIcon
            color="gray.5"
            sx={(theme) => ({
              ":hover": {
                color: theme.colors.gray[7],
                backgroundColor: theme.colors.indigo[1],
              },
            })}
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
            color="gray.5"
            sx={(theme) => ({
              ":hover": {
                color: theme.colors.gray[7],
                backgroundColor: theme.colors.indigo[1],
              },
            })}
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
      </Group>
      <Divider color="gray.2" />
      {(tab === "all"
        ? reversedEntries
        : reversedEntries.filter((entry) => favoriteEntryIdsSet.has(entry.id))
      ).map((entry) => (
        <Stack
          spacing={0}
          sx={(theme) => ({
            cursor: "pointer",
            ":hover": { backgroundColor: theme.colors.indigo[0] },
          })}
          onClick={async () => {
            await navigator.clipboard.writeText(entry.content);

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
            <Group align="center" px="md" noWrap>
              <Badge
                color={entry.content === clipboardContent ? "indigo.4" : "gray.5"}
                variant="filled"
                w={100}
              >
                {entry.content === clipboardContent
                  ? "Copied"
                  : badgeDateFormatter(new Date(entry.createdAt))}
              </Badge>
            </Group>
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
            <EntryActions entry={entry} favoriteEntryIds={favoriteEntryIds} />
          </Group>
          <Divider color="gray.2" />
        </Stack>
      ))}
    </Box>
  );
};
