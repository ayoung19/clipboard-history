import {
  ActionIcon,
  Card,
  Divider,
  Group,
  Image,
  Indicator,
  rem,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconClipboardList,
  IconCloud,
  IconExternalLink,
  IconHeart,
  IconHelp,
  IconNews,
  IconPictureInPicture,
  IconSearch,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import iconSrc from "data-base64:~assets/icon.png";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import type {
  UpdateContextMenusRequestBody,
  UpdateContextMenusResponseBody,
} from "~background/messages/updateContextMenus";
import {
  getChangelogViewedAt,
  updateChangelogViewedAt,
  watchChangelogViewedAt,
} from "~storage/changelogViewedAt";
import {
  getClipboardMonitorIsEnabled,
  toggleClipboardMonitorIsEnabled,
  watchClipboardMonitorIsEnabled,
} from "~storage/clipboardMonitorIsEnabled";
import { getClipboardSnapshot, watchClipboardSnapshot } from "~storage/clipboardSnapshot";
import { getEntryCommands, watchEntryCommands } from "~storage/entryCommands";
import { getEntryIdToTags, watchEntryIdToTags } from "~storage/entryIdToTags";
import { getFavoriteEntryIds, watchFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { getRefreshToken, watchRefreshToken } from "~storage/refreshToken";
import { getSettings, watchSettings } from "~storage/settings";
import { Tab } from "~types/tab";
import { getEntries, watchEntries } from "~utils/storage";
import { defaultBorderColor, lightOrDark } from "~utils/sx";
import { VERSION } from "~utils/version";

import { UserActionIcon } from "./components/cloud/UserActionIcon";
import { SettingsModalContent } from "./components/modals/SettingsModalContent";
import { AllPage } from "./pages/AllPage";
import { CloudPage } from "./pages/CloudPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import {
  changelogViewedAtAtom,
  clipboardMonitorIsEnabledAtom,
  clipboardSnapshotAtom,
  commandsAtom,
  entriesAtom,
  entryCommandsAtom,
  entryIdToTagsAtom,
  favoriteEntryIdsAtom,
  refreshTokenAtom,
  searchAtom,
  settingsAtom,
} from "./states/atoms";

export const App = () => {
  const theme = useMantineTheme();

  const [tab, setTab] = useState<Tab>(Tab.Enum.All);
  const [isFloatingPopup] = useState(
    new URLSearchParams(window.location.search).get("ref") === "popup",
  );

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

  const [clipboardMonitorIsEnabled, setClipboardMonitorIsEnabled] = useAtom(
    clipboardMonitorIsEnabledAtom,
  );
  const setEntries = useSetAtom(entriesAtom);
  const setEntryCommands = useSetAtom(entryCommandsAtom);
  const setCommands = useSetAtom(commandsAtom);
  const setClipboardSnapshot = useSetAtom(clipboardSnapshotAtom);
  const setFavoriteEntryIds = useSetAtom(favoriteEntryIdsAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const setEntryIdToTags = useSetAtom(entryIdToTagsAtom);
  const [changelogViewedAt, setChangelogViewedAt] = useAtom(changelogViewedAtAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  useEffect(() => {
    getClipboardMonitorIsEnabled().then(setClipboardMonitorIsEnabled);
    watchClipboardMonitorIsEnabled(setClipboardMonitorIsEnabled);

    (async () => setEntries(await getEntries()))();
    watchEntries((entries) => {
      setEntries(entries);
      updateContextMenus();
    });

    getEntryCommands().then(setEntryCommands);
    watchEntryCommands(setEntryCommands);

    // Filter out commands without names as they aren't useful to us.
    chrome.commands.getAll((commands) =>
      setCommands(
        commands.flatMap((command) =>
          command.name ? { name: command.name, shortcut: command.shortcut } : [],
        ),
      ),
    );

    (async () => setClipboardSnapshot(await getClipboardSnapshot()))();
    watchClipboardSnapshot(setClipboardSnapshot);

    (async () => setFavoriteEntryIds(await getFavoriteEntryIds()))();
    watchFavoriteEntryIds((favoriteEntryIds) => {
      setFavoriteEntryIds(favoriteEntryIds);
      updateContextMenus();
    });

    (async () => {
      const s = await getSettings();

      setSettings(s);
      setTab(s.defaultTab);
    })();
    watchSettings(setSettings);

    (async () => setEntryIdToTags(await getEntryIdToTags()))();
    watchEntryIdToTags((entryIdToTags) => {
      setEntryIdToTags(entryIdToTags);
      updateContextMenus();
    });

    getChangelogViewedAt().then(setChangelogViewedAt);
    watchChangelogViewedAt(setChangelogViewedAt);

    getRefreshToken().then(setRefreshToken);
    watchRefreshToken(setRefreshToken);
  }, []);

  if (clipboardMonitorIsEnabled === undefined) {
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
              <Indicator
                color={lightOrDark(theme, "red.5", "red.7")}
                size={8}
                disabled={!settings.changelogIndicator || changelogViewedAt === VERSION}
              >
                <ActionIcon
                  variant="light"
                  color="indigo.5"
                  onClick={async () => {
                    await updateChangelogViewedAt();

                    await chrome.tabs.create({
                      url: "https://github.com/ayoung19/clipboard-history/releases",
                    });

                    if (!isFloatingPopup) {
                      window.close();
                    }
                  }}
                >
                  <IconNews size="1.125rem" />
                </ActionIcon>
              </Indicator>
            </Tooltip>
            <Tooltip
              label={
                <Group align="center" spacing={rem(4)} noWrap>
                  <Text fz="xs">Support Development</Text>
                  <IconExternalLink size="0.8rem" />
                </Group>
              }
            >
              <ActionIcon
                variant="light"
                color="indigo.5"
                component="a"
                href="https://www.clipboardhistory.io/support"
                target="_blank"
              >
                <IconHeart size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                <Group align="center" spacing={rem(4)} noWrap>
                  <Text fz="xs">Help & Feedback</Text>
                  <IconExternalLink size="0.8rem" />
                </Group>
              }
            >
              <ActionIcon
                variant="light"
                color="indigo.5"
                component="a"
                href="https://chromewebstore.google.com/detail/ombhfdknibjljckajldielimdjcomcek/support"
                target="_blank"
              >
                <IconHelp size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" h={16} sx={{ alignSelf: "inherit" }} />
            <Tooltip label={<Text fz="xs">Floating Mode</Text>} disabled={isFloatingPopup}>
              <ActionIcon
                variant="light"
                color="indigo.5"
                onClick={async () => {
                  await chrome.windows.create({
                    url: chrome.runtime.getURL("popup.html?ref=popup"),
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
            {refreshToken && <UserActionIcon />}
            <Divider orientation="vertical" h={16} sx={{ alignSelf: "inherit" }} />
            <Switch
              size="md"
              color="indigo.5"
              checked={clipboardMonitorIsEnabled}
              onChange={() => toggleClipboardMonitorIsEnabled()}
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
            sx={{
              ".mantine-Input-input": {
                borderColor: defaultBorderColor(theme),
                "&:focus, &:focus-within": {
                  borderColor: theme.fn.primaryColor(),
                },
              },
            }}
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
