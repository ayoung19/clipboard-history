import { Box, Group, Image, SegmentedControl, Switch, Text, TextInput, Title } from "@mantine/core";
import { IconClipboardList, IconSearch, IconStar } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import iconSrc from "data-base64:~assets/icon.png";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getClipboardSnapshot, watchClipboardSnapshot } from "~storage/clipboardSnapshot";
import { getFavoriteEntryIds, watchFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getEntries, watchEntries } from "~utils/storage";

import { AllPage } from "./pages/AllPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import {
  clipboardSnapshotAtom,
  entriesAtom,
  favoriteEntryIdsAtom,
  searchAtom,
} from "./states/atoms";

export const App = () => {
  const [tab, setTab] = useState("all");

  const [search, setSearch] = useAtom(searchAtom);

  const setEntries = useSetAtom(entriesAtom);
  const setClipboardSnapshot = useSetAtom(clipboardSnapshotAtom);
  const setFavoriteEntryIds = useSetAtom(favoriteEntryIdsAtom);
  useEffect(() => {
    (async () => setEntries(await getEntries()))();
    watchEntries(setEntries);

    (async () => setClipboardSnapshot(await getClipboardSnapshot()))();
    watchClipboardSnapshot(setClipboardSnapshot);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds(setFavoriteEntryIds);
  }, []);

  const queryClient = useQueryClient();
  const clipboardMonitorIsEnabledQuery = useQuery({
    queryKey: ["clipboardMonitorIsEnabled"],
    queryFn: getClipboardMonitorIsEnabled,
  });
  const toggleClipboardMonitorIsEnabledMutation = useMutation({
    mutationFn: toggleClipboardMonitorIsEnabled,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clipboardMonitorIsEnabled"] }),
  });

  if (clipboardMonitorIsEnabledQuery.isPending || clipboardMonitorIsEnabledQuery.isError) {
    return null;
  }

  return (
    <Box p="sm">
      <Group align="center" position="apart" mb="sm">
        <Group align="center" spacing="xs">
          <Image src={iconSrc} maw={28} />
          <Title order={6} color="gray.8">
            Clipboard History Pro
          </Title>
        </Group>
        <Switch
          size="md"
          color="indigo.5"
          checked={clipboardMonitorIsEnabledQuery.data}
          onChange={() => toggleClipboardMonitorIsEnabledMutation.mutate()}
        />
      </Group>
      <Group align="center" position="apart" mb="sm">
        <Group align="center">
          <TextInput
            placeholder="Search"
            icon={<IconSearch size="1rem" />}
            size="xs"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={240}
            sx={(theme) => ({
              ".mantine-Input-input": {
                color: theme.colors.gray[8],
                borderColor: theme.colors.gray[3],
                "&:focus, &:focus-within": {
                  borderColor: theme.colors.indigo[3],
                },
              },
            })}
          />
        </Group>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          size="xs"
          color={tab === "all" ? "indigo.5" : "yellow.5"}
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
      {tab === "all" ? <AllPage /> : <FavoritesPage />}
    </Box>
  );
};
