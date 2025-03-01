import {
  ActionIcon,
  Badge,
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
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { match } from "ts-pattern";

import { updateChangelogViewedAt } from "~storage/changelogViewedAt";
import { toggleClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { Tab } from "~types/tab";
import { defaultBorderColor, lightOrDark } from "~utils/sx";
import { VERSION } from "~utils/version";

import { UserActionIcon } from "./components/cloud/UserActionIcon";
import { SettingsModalContent } from "./components/modals/SettingsModalContent";
import { useApp } from "./hooks/useApp";
import { AllPage } from "./pages/AllPage";
import { CloudPage } from "./pages/CloudPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import {
  changelogViewedAtAtom,
  clipboardMonitorIsEnabledAtom,
  refreshTokenAtom,
  searchAtom,
  settingsAtom,
  tabAtom,
} from "./states/atoms";

export const App = () => {
  useApp();

  const theme = useMantineTheme();

  const [isFloatingPopup] = useState(
    new URLSearchParams(window.location.search).get("ref") === "popup",
  );

  const [search, setSearch] = useAtom(searchAtom);
  const [tab, setTab] = useAtom(tabAtom);

  const clipboardMonitorIsEnabled = useAtomValue(clipboardMonitorIsEnabledAtom);
  const settings = useAtomValue(settingsAtom);
  const changelogViewedAt = useAtomValue(changelogViewedAtAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);

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
            <Badge size="xs" color="cyan">
              Pro
            </Badge>
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
            color={match(tab)
              .with(Tab.Enum.All, () => "indigo.5")
              .with(Tab.Enum.Favorites, () => "yellow.5")
              .with(Tab.Enum.Cloud, () => "cyan.5")
              .exhaustive()}
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
        {match(tab)
          .with(Tab.Enum.All, () => <AllPage />)
          .with(Tab.Enum.Favorites, () => <FavoritesPage />)
          .with(Tab.Enum.Cloud, () => <CloudPage />)
          .exhaustive()}
      </Stack>
    </Card>
  );
};
