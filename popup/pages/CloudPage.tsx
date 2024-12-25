import { Button, Stack, Text, Title } from "@mantine/core";

import { EntryList } from "~popup/components/EntryList";

export const CloudPage = () => {
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
