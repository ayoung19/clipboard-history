import { Button, Stack, Text, Title } from "@mantine/core";
import { useAtomValue } from "jotai";

import { CheckoutButton } from "~popup/components/cloud/CheckoutButton";
import { EntryList } from "~popup/components/EntryList";
import { refreshTokenAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

export const CloudPage = () => {
  const refreshToken = useAtomValue(refreshTokenAtom);
  const subscriptionsQuery = db.useQuery(
    refreshToken
      ? {
          subscriptions: {},
        }
      : null,
  );

  if (!refreshToken) {
    // TODO: Mention free trial.
    return (
      <EntryList
        noEntriesOverlay={
          <Stack align="center" spacing="xs" p="xl">
            <Title order={4}>Sync Your Clipboard History Everywhere</Title>
            <Text size="sm" w={500} align="center">
              Privately and securely sync your clipboard history across all your devices.
            </Text>
            <Button
              size="xs"
              mt="xs"
              component="a"
              href={chrome.runtime.getURL("/tabs/sign-in.html")}
              target="_blank"
            >
              Sign In / Sign Up
            </Button>
          </Stack>
        }
        entries={[]}
      />
    );
  }

  if (!subscriptionsQuery.data?.subscriptions.length) {
    return (
      <EntryList
        noEntriesOverlay={
          <Stack align="center" spacing="xs" p="xl">
            <Title order={4}>Sync Your Clipboard History Everywhere</Title>
            <Text size="sm" w={500} align="center">
              Privately and securely sync your clipboard history across all your devices.
            </Text>
            <CheckoutButton />
          </Stack>
        }
        entries={[]}
      />
    );
  }

  return (
    <EntryList
      noEntriesOverlay={
        <Stack align="center" spacing="xs" p="xl">
          <Title order={4}>Optionally Sync Your Clipboard History Everywhere - Coming Soon</Title>
          <Text size="sm" w={500} align="center">
            Privately and securely sync your clipboard history across all your devices. Be the first
            to know when clipboard syncing launches!
          </Text>
          <Button
            size="xs"
            mt="xs"
            component="a"
            href="https://www.clipboardhistory.io/cloud"
            target="_blank"
          >
            Get Notified
          </Button>
        </Stack>
      }
      entries={[]}
    />
  );
};
