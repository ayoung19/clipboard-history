import {
  ActionIcon,
  Box,
  Checkbox,
  Divider,
  Group,
  SegmentedControl,
  Switch,
  TextInput,
} from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconSearch, IconStar, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { getClipboardContent, watchClipboardContent } from "~storage/clipboardContent";
import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitor";
import {
  addFavoriteEntryIds,
  deleteFavoriteEntryIds,
  getFavoriteEntryIds,
  watchFavoriteEntryIds,
} from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries, getEntries, watchEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { EntryList } from "./components/EntryList";

export const App = () => {
  const [tab, setTab] = useState("all");

  const selectedEntryIds = useSet<string>();

  const [entries, setEntries] = useState<Entry[]>([]);
  const reversedEntries = useMemo(() => entries.toReversed(), [entries]);

  const [clipboardContent, setClipboardContent] = useState<string>();

  const [favoriteEntryIds, setFavoriteEntryIds] = useState<string[]>([]);
  const favoriteEntryIdsSet = useMemo(() => new Set(favoriteEntryIds), [favoriteEntryIds]);

  const queryClient = useQueryClient();
  const clipboardMonitorIsEnabledQuery = useQuery({
    queryKey: ["clipboardMonitorIsEnabled"],
    queryFn: getClipboardMonitorIsEnabled,
  });
  const toggleClipboardMonitorIsEnabledMutation = useMutation({
    mutationFn: toggleClipboardMonitorIsEnabled,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clipboardMonitorIsEnabled"] }),
  });

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

  if (clipboardMonitorIsEnabledQuery.isPending || clipboardMonitorIsEnabledQuery.isError) {
    return null;
  }

  return (
    <Box>
      <Group align="center" position="apart" px="md" py="xs">
        <Group align="center">
          <Switch
            size="md"
            color="indigo.4"
            checked={clipboardMonitorIsEnabledQuery.data}
            onChange={() => toggleClipboardMonitorIsEnabledMutation.mutate()}
          />
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
          checked={selectedEntryIds.size > 0 && selectedEntryIds.size === entries.length}
          indeterminate={selectedEntryIds.size > 0 && selectedEntryIds.size < entries.length}
          onChange={() =>
            selectedEntryIds.size === 0
              ? entries.forEach((entry) => selectedEntryIds.add(entry.id))
              : selectedEntryIds.clear()
          }
        />
        <Group spacing={0}>
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
      <EntryList
        entries={
          tab === "all"
            ? reversedEntries
            : reversedEntries.filter((entry) => favoriteEntryIdsSet.has(entry.id))
        }
        clipboardContent={clipboardContent}
        selectedEntryIds={selectedEntryIds}
        favoriteEntryIdsSet={favoriteEntryIdsSet}
        onEntryClick={async (entry) => {
          await navigator.clipboard.writeText(entry.content);

          setClipboardContent(entry.content);
        }}
      />
    </Box>
  );
};
