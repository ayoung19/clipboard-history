import { Box, Divider, Group, Switch, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { max } from "date-fns";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { getClipboardContent, watchClipboardContent } from "~storage/clipboardContent";
import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getFavoriteEntryIds, watchFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { Page } from "~types/page";
import { getEntries, watchEntries } from "~utils/storage";

import { EntryList } from "./components/EntryList";
import { SmartSegmentedControl } from "./components/SmartSegmentedControl";
import {
  clipboardContentAtom,
  entriesAtom,
  lockedReversedEntriesAtom,
  pageAtom,
  reversedEntriesAtom,
  searchAtom,
  unlockedReversedEntriesAtom,
} from "./state/atoms";

export const App = () => {
  const [now] = useState(new Date());

  const page = useAtomValue(pageAtom);
  const [search, setSearch] = useAtom(searchAtom);

  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const unlockedReversedEntries = useAtomValue(unlockedReversedEntriesAtom);
  const lockedReversedEntries = useAtomValue(lockedReversedEntriesAtom);

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

  const setEntries = useSetAtom(entriesAtom);
  const setClipboardContent = useSetAtom(clipboardContentAtom);

  useEffect(() => {
    (async () => setEntries(await getEntries()))();
    watchEntries(setEntries);

    (async () => setClipboardContent(await getClipboardContent()))();
    watchClipboardContent(setClipboardContent);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds(setFavoriteEntryIds);
  }, []);

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
          <TextInput
            placeholder="Search"
            icon={<IconSearch size="1rem" />}
            size="xs"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Group>
        <SmartSegmentedControl />
      </Group>
      <Divider color="gray.2" />
      <EntryList
        now={max([new Date(reversedEntries[0]?.createdAt || 0), now])}
        entries={(page === Page.All
          ? unlockedReversedEntries
          : page === Page.Favorites
            ? unlockedReversedEntries.filter((entry) => favoriteEntryIdsSet.has(entry.id))
            : lockedReversedEntries
        ).filter(
          (entry) =>
            search.length === 0 || entry.content.toLowerCase().includes(search.toLowerCase()),
        )}
        favoriteEntryIdsSet={favoriteEntryIdsSet}
      />
    </Box>
  );
};
