import {
  ActionIcon,
  Card,
  Divider,
  Group,
  Image,
  rem,
  SegmentedControl,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconClipboardList,
  IconExternalLink,
  IconNews,
  IconSearch,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import iconSrc from "data-base64:~assets/icon.png";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getClipboardSnapshot, watchClipboardSnapshot } from "~storage/clipboardSnapshot";
import { getEntryIdToTags, watchEntryIdToTags } from "~storage/entryIdToTags";
import { getFavoriteEntryIds, watchFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getSettings, watchSettings } from "~storage/settings";
import { Tab } from "~types/tab";
import { getEntries, watchEntries } from "~utils/storage";
import { defaultBorderColor } from "~utils/sx";

import { SettingsModalContent } from "./components/modals/SettingsModalContent";
import { AllPage } from "./pages/AllPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import {
  clipboardSnapshotAtom,
  entriesAtom,
  entryIdToTagsAtom,
  favoriteEntryIdsAtom,
  searchAtom,
  settingsAtom,
} from "./states/atoms";

export const App = () => {
  const [tab, setTab] = useState<Tab>(Tab.Enum.All);

  const [search, setSearch] = useAtom(searchAtom);

  const setEntries = useSetAtom(entriesAtom);
  const setClipboardSnapshot = useSetAtom(clipboardSnapshotAtom);
  const setFavoriteEntryIds = useSetAtom(favoriteEntryIdsAtom);
  const setSettings = useSetAtom(settingsAtom);
  const setEntryIdToTags = useSetAtom(entryIdToTagsAtom);
  useEffect(() => {
    (async () => setEntries(await getEntries()))();
    watchEntries(setEntries);

    (async () => setClipboardSnapshot(await getClipboardSnapshot()))();
    watchClipboardSnapshot(setClipboardSnapshot);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds(setFavoriteEntryIds);

    (async () => {
      const settings = await getSettings();

      setSettings(settings);
      setTab(settings.defaultTab);
    })();
    watchSettings(setSettings);

    (async () => setEntryIdToTags(await getEntryIdToTags()))();
    watchEntryIdToTags(setEntryIdToTags);
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
    <Card p="sm">
      <Group align="center" position="apart" mb="sm">
        <Group align="center" spacing="xs">
          <Image src={iconSrc} maw={28} />
          <Title order={6}>Clipboard History Pro</Title>
        </Group>
        <Group align="center" spacing="xs" grow={false}>
          <Tooltip
            label={
              <Group align="center" spacing={rem(4)} noWrap>
                <Text fz="xs">Changelog</Text>
                <IconExternalLink size="0.8rem" />
              </Group>
            }
          >
            <ActionIcon
              variant="light"
              color="indigo.5"
              component="a"
              href="https://github.com/ayoung19/clipboard-history/releases"
              target="_blank"
            >
              <IconNews size="1.125rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={<Text fz="xs">Settings</Text>}>
            <ActionIcon
              variant="light"
              color="indigo.5"
              onClick={() =>
                modals.open({
                  padding: 0,
                  size: "xl",
                  withCloseButton: false,
                  children: <SettingsModalContent />,
                })
              }
            >
              <IconSettings size="1.125rem" />
            </ActionIcon>
          </Tooltip>
          <Divider orientation="vertical" h={16} sx={{ alignSelf: "inherit" }} />
          <Switch
            size="md"
            color="indigo.5"
            checked={clipboardMonitorIsEnabledQuery.data}
            onChange={() => toggleClipboardMonitorIsEnabledMutation.mutate()}
          />
        </Group>
      </Group>
      <Group align="center" position="apart" mb="sm">
        <TextInput
          placeholder="Search items or tags"
          icon={<IconSearch size="1rem" />}
          size="xs"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={240}
          sx={(theme) => ({
            ".mantine-Input-input": {
              borderColor: defaultBorderColor(theme),
              "&:focus, &:focus-within": {
                borderColor: theme.fn.primaryColor(),
              },
            },
          })}
          autoFocus
        />
        <SegmentedControl
          value={tab}
          onChange={(newTab) => setTab(Tab.parse(newTab))}
          size="xs"
          color={tab === Tab.Enum.All ? "indigo.5" : "yellow.5"}
          data={[
            {
              label: (
                <Group align="center" spacing={4} noWrap>
                  <IconClipboardList size="1rem" />
                  <Text>All</Text>
                </Group>
              ),
              value: Tab.Enum.All,
            },
            {
              label: (
                <Group align="center" spacing={4} noWrap>
                  <IconStar size="1rem" />
                  <Text>Favorites</Text>
                </Group>
              ),
              value: Tab.Enum.Favorites,
            },
          ]}
        />
      </Group>
      {tab === Tab.Enum.All ? <AllPage /> : <FavoritesPage />}
    </Card>
  );
};
