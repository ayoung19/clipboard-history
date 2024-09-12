import {
  Box,
  Divider,
  Group,
  Image,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconClipboardList, IconSearch, IconStar } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import icon from "data-base64:~assets/icon.png";
import { max } from "date-fns";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { getClipboardContent, watchClipboardContent } from "~storage/clipboardContent";
import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getFavoriteEntryIds, watchFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { getEntries, watchEntries } from "~utils/storage";

import { EntryList } from "./components/EntryList";
import { clipboardContentAtom } from "./states/atoms";

export const App = () => {
  const [now] = useState(new Date());

  const [tab, setTab] = useState("all");

  const [search, setSearch] = useState("");

  const [entries, setEntries] = useState<Entry[]>([]);
  const reversedEntries = useMemo(() => entries.toReversed(), [entries]);

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
    <Box p="sm">
      <Stack spacing="sm" mb="sm">
        <Group align="center" position="apart">
          <Group spacing="xs">
            <Image src={icon} maw={28} />
            <Title order={5} color="gray.8">
              Clipboard History Pro
            </Title>
          </Group>
          <Switch
            size="md"
            color="indigo.4"
            checked={clipboardMonitorIsEnabledQuery.data}
            onChange={() => toggleClipboardMonitorIsEnabledMutation.mutate()}
          />
        </Group>
        <Group align="center" position="apart">
          <TextInput
            placeholder="Search"
            icon={<IconSearch size="1rem" />}
            size="xs"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <SegmentedControl
            value={tab}
            onChange={setTab}
            size="xs"
            color={tab === "all" ? "indigo.4" : "yellow.5"}
            data={[
              {
                label: (
                  <Group align="center" spacing={4} noWrap>
                    <IconClipboardList size="1rem" />
                    <Text>All</Text>
                  </Group>
                ),
                value: "all",
              },
              {
                label: (
                  <Group align="center" spacing={4} noWrap>
                    <IconStar size="1rem" />
                    <Text>Favorites</Text>
                  </Group>
                ),
                value: "favorites",
              },
            ]}
          />
        </Group>
      </Stack>
      <Divider color="gray.2" />
      <EntryList
        now={max([new Date(reversedEntries[0]?.createdAt || 0), now])}
        entries={(tab === "all"
          ? reversedEntries
          : reversedEntries.filter((entry) => favoriteEntryIdsSet.has(entry.id))
        ).filter(
          (entry) =>
            search.length === 0 || entry.content.toLowerCase().includes(search.toLowerCase()),
        )}
        favoriteEntryIdsSet={favoriteEntryIdsSet}
      />
    </Box>
  );
};
