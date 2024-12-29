import {
  ActionIcon,
  Card,
  Divider,
  Group,
  Image,
  rem,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconClipboardList,
  IconCloud,
  IconExternalLink,
  IconNews,
  IconPictureInPicture,
  IconSearch,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import iconSrc from "data-base64:~assets/icon.png";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import type {
  UpdateContextMenusRequestBody,
  UpdateContextMenusResponseBody,
} from "~background/messages/updateContextMenus";
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
import { CloudPage } from "./pages/CloudPage";
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
  const [isFloatingPopup] = useState(window.location.pathname === "/tabs/floating-popup.html");

  const [search, setSearch] = useAtom(searchAtom);

  // TODO: For actions that take a while to render (e.g. deleting an entry), the user could close
  // the popup before the mutation is rendered causing the context menus to be stale until the user
  // switches tabs. I decided on this approach as opposed to directly calling the sync function in
  // the respective storage mutation functions because I like the idea of keeping context menu
  // updates as separate from core extension logic. We can stick with this until it becomes a
  // serious pain point for users.
  const updateContextMenus = useDebouncedCallback(
    () =>
      sendToBackground<UpdateContextMenusRequestBody, UpdateContextMenusResponseBody>({
        name: "updateContextMenus",
      }),
    100,
  );

  const setEntries = useSetAtom(entriesAtom);
  const setClipboardSnapshot = useSetAtom(clipboardSnapshotAtom);
  const setFavoriteEntryIds = useSetAtom(favoriteEntryIdsAtom);
  const setSettings = useSetAtom(settingsAtom);
  const setEntryIdToTags = useSetAtom(entryIdToTagsAtom);
  useEffect(() => {
    (async () => setEntries(await getEntries()))();
    watchEntries((entries) => {
      setEntries(entries);
      updateContextMenus();
    });

    (async () => setClipboardSnapshot(await getClipboardSnapshot()))();
    watchClipboardSnapshot(setClipboardSnapshot);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds((favoriteEntryIds) => {
      setFavoriteEntryIds(favoriteEntryIds);
      updateContextMenus();
    });

    (async () => {
      const settings = await getSettings();

      setSettings(settings);
      setTab(settings.defaultTab);
    })();
    watchSettings(setSettings);

    (async () => setEntryIdToTags(await getEntryIdToTags()))();
    watchEntryIdToTags((entryIdToTags) => {
      setEntryIdToTags(entryIdToTags);
      updateContextMenus();
    });
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
    <Card h={isFloatingPopup ? "100%" : 600} w={isFloatingPopup ? "100%" : 700} miw={500} p="sm">
      <Stack h="100%" spacing="sm">
        <Group align="center" position="apart">
          <Group align="center" spacing="xs">
            <Image src={iconSrc} maw={28} />
            <Title order={6}>Clipboard History IO</Title>
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
            <Tooltip label={<Text fz="xs">Floating Mode</Text>} disabled={isFloatingPopup}>
              <ActionIcon
                variant="light"
                color="indigo.5"
                onClick={async () => {
                  await chrome.windows.create({
                    url: chrome.runtime.getURL("tabs/floating-popup.html"),
                    type: "popup",
                    height: 600,
                    width: 700,
                  });

                  window.close();
                }}
                disabled={isFloatingPopup}
              >
                <IconPictureInPicture size="1.125rem" />
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
        <Group align="center" position="apart">
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
            color={
              tab === Tab.Enum.All ? "indigo.5" : tab === Tab.Enum.Favorites ? "yellow.5" : "cyan.5"
            }
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
              {
                label: (
                  <Group align="center" spacing={4} noWrap>
                    <IconCloud size="1rem" />
                    <Text>Cloud</Text>
                  </Group>
                ),
                value: Tab.Enum.Cloud,
              },
            ]}
          />
        </Group>
        {tab === Tab.Enum.All ? (
          <AllPage />
        ) : tab === Tab.Enum.Favorites ? (
          <FavoritesPage />
        ) : (
          <CloudPage />
        )}
      </Stack>
    </Card>
  );
};
