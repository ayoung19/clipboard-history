import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  rem,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCheck,
  IconCloud,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconWifiOff,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { CommonActionIcon } from "~popup/components/CommonActionIcon";
import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { useSubscriptionsQuery } from "~popup/hooks/useSubscriptionsQuery";
import { searchAtom } from "~popup/states/atoms";
import db from "~utils/db/react";
import { lightOrDark } from "~utils/sx";

export const CloudPage = () => {
  const theme = useMantineTheme();

  const search = useAtomValue(searchAtom);

  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const entries = useEntries();
  const entryIdToTags = useEntryIdToTags();
  const subscriptionsQuery = useSubscriptionsQuery();

  if (auth.user && connectionStatus === "closed") {
    return (
      <EntryList
        noEntriesOverlay={
          <Stack align="center" spacing="xs" p="xl">
            <IconWifiOff size="1.125rem" />
            <Title order={4}>{chrome.i18n.getMessage("commonOffline")}</Title>
            <Text size="sm" w={500} align="center">
              {chrome.i18n.getMessage("overlayOfflineSubtitle")}
            </Text>
          </Stack>
        }
        entries={[]}
      />
    );
  }

  // TODO: Highlight mobile app.
  if (!subscriptionsQuery.data?.subscriptions.length) {
    return (
      <EntryList
        noEntriesOverlay={
          <Group p="md" align="flex-start" noWrap>
            <Stack spacing={0} align="flex-start">
              <Group mb="xs">
                <IconDeviceMobile />
                <Loader variant="dots" color="dark" size="xs" />
                <IconDeviceDesktop />
                <Loader variant="dots" color="dark" size="xs" />
                <IconDeviceTablet />
              </Group>
              <Title order={4} mb={rem(8)}>
                {chrome.i18n.getMessage("cloudPromoTitle")}
              </Title>
              <Text size="sm" mb={rem(8)}>
                {chrome.i18n.getMessage("cloudPromoSubtitle")}
              </Text>
              <Text size="sm" mb="md">
                {chrome.i18n.getMessage("cloudPromoTrial")}
              </Text>
              <Button
                size="xs"
                mb={rem(4)}
                component="a"
                href={chrome.runtime.getURL("/tabs/sign-in.html")}
                target="_blank"
              >
                {chrome.i18n.getMessage("cloudPromoGetStarted")}
              </Button>
              <Text color="dimmed" fz="xs" fs="italic">
                {chrome.i18n.getMessage("cloudPromoSupportText")}
              </Text>
            </Stack>
            <Card p="md" w={260} bg={lightOrDark(theme, "gray.1", "dark.7")} sx={{ flexShrink: 0 }}>
              <Stack spacing={rem(8)}>
                <Title order={5}>{chrome.i18n.getMessage("cloudPromoProFeatures")}</Title>
                <Group align="center" spacing={rem(8)} noWrap>
                  <IconCheck size="1rem" color={theme.fn.primaryColor()} />
                  <Text fz="sm">{chrome.i18n.getMessage("cloudPromoFeatureCrossDevice")}</Text>
                </Group>
                <Group align="center" spacing={rem(8)} noWrap>
                  <IconCheck size="1rem" color={theme.fn.primaryColor()} />
                  <Text fz="sm">{chrome.i18n.getMessage("cloudPromoFeatureWebApp")}</Text>
                </Group>
                <Group align="center" spacing={rem(8)} noWrap>
                  <IconCheck size="1rem" color={theme.fn.primaryColor()} />
                  <Text fz="sm">{chrome.i18n.getMessage("cloudPromoFeaturePriority")}</Text>
                </Group>
                <Group align="center" spacing={rem(8)} noWrap>
                  <IconCheck size="1rem" color={theme.fn.primaryColor()} />
                  <Text fz="sm">{chrome.i18n.getMessage("cloudPromoFeatureMobileApp")}</Text>
                  <Badge size="xs" variant="outline" mt={rem(2)} color="teal">
                    {chrome.i18n.getMessage("cloudPromoBadgeNew")}
                  </Badge>
                </Group>
                <Group align="center" spacing={rem(8)} noWrap>
                  <IconCheck size="1rem" color={theme.fn.primaryColor()} />
                  <Text fz="sm">{chrome.i18n.getMessage("cloudPromoFeatureE2E")}</Text>
                  <Badge size="xs" variant="outline" mt={rem(2)}>
                    {chrome.i18n.getMessage("cloudPromoBadgeSoon")}
                  </Badge>
                </Group>
              </Stack>
            </Card>
          </Group>
        }
        entries={[]}
      />
    );
  }

  return (
    <EntryList
      noEntriesOverlay={
        search.length === 0 ? (
          <NoEntriesOverlay
            title={chrome.i18n.getMessage("overlayNoCloudTitle")}
            subtitle={
              <Group align="center" spacing={0}>
                <Text>{chrome.i18n.getMessage("overlayNoCloudSubtitlePrefix")}</Text>
                <CommonActionIcon>
                  <IconCloud size="1rem" />
                </CommonActionIcon>
              </Group>
            }
            description={chrome.i18n.getMessage("overlayNoCloudDescription")}
          />
        ) : (
          <NoEntriesOverlay title={chrome.i18n.getMessage("overlayNoResultsTitle", [search])} />
        )
      }
      entries={entries.filter(
        (entry) =>
          entry.id.length === 36 &&
          (search.length === 0 ||
            entry.content.toLowerCase().includes(search.toLowerCase()) ||
            entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase()))),
      )}
    />
  );
};
