import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconCloud } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { CommonActionIcon } from "~popup/components/CommonActionIcon";
import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { useSubscriptionsQuery } from "~popup/hooks/useSubscriptionsQuery";
import { searchAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

export const CloudPage = () => {
  const search = useAtomValue(searchAtom);

  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const entries = useEntries();
  const entryIdToTags = useEntryIdToTags();
  const subscriptionsQuery = useSubscriptionsQuery();

  // TODO: Offline.
  if (auth.user && connectionStatus === "closed") {
    return (
      <EntryList
        noEntriesOverlay={
          <Stack align="center" spacing="xs" p="xl">
            <Title order={4}>Optionally Sync Your Clipboard History Everywhere</Title>
            <Text size="sm" w={500} align="center">
              Privately and securely sync your clipboard history across all your devices!
            </Text>
            <Button
              size="xs"
              mt="xs"
              component="a"
              href={chrome.runtime.getURL("/tabs/sign-in.html")}
              target="_blank"
            >
              Get Started
            </Button>
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
          <Stack align="center" spacing="xs" p="xl">
            <Title order={4}>Optionally Sync Your Clipboard History Everywhere</Title>
            <Text size="sm" w={500} align="center">
              Privately and securely sync your clipboard history across all your devices!
            </Text>
            <Button
              size="xs"
              mt="xs"
              component="a"
              href={chrome.runtime.getURL("/tabs/sign-in.html")}
              target="_blank"
            >
              Get Started
            </Button>
          </Stack>
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
            title="You have no items stored in the cloud"
            subtitle={
              <Group align="center" spacing={0}>
                <Text>Store an item in the cloud by clicking on</Text>
                <CommonActionIcon>
                  <IconCloud size="1rem" />
                </CommonActionIcon>
              </Group>
            }
            description="Items stored in the cloud can be accessed from other devices"
          />
        ) : (
          <NoEntriesOverlay title={`No items found for "${search}"`} />
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
