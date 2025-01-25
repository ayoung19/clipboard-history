import {
  Button,
  Group,
  Kbd,
  Paper,
  Radio,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";

import type { Entry } from "~types/entry";
import { getShortcuts } from "~utils/storage/shortcuts";

interface Props {
  selectedEntries: Entry[];
}

export const ShortcutsModalContent = ({ selectedEntries }: Props) => {
  const shortcutsQuery = useQuery({
    queryKey: ["shortcutsQuery"],
    queryFn: getShortcuts,
  });

  if (!shortcutsQuery) {
    return <Title order={5}>Shortcuts not enabled for this extension.</Title>;
  }

  function formatShortcut(shortcut: string) {
    const keys = shortcut.split("");

    return (
      <div dir="ltr">
        {keys.map((key, index) => (
          <span key={index}>
            <Kbd>{key.trim()}</Kbd>
            {index < keys.length - 1 && " + "}
          </span>
        ))}
      </div>
    );
  }

  const options =
    shortcutsQuery.data?.map((shortcut) => ({
      value: shortcut.shortcut,
      label: formatShortcut(shortcut.shortcut),
    })) ?? [];

  return (
    <Paper p="md">
      <Stack spacing={0}>
        <Title order={6}>Assign a Shortcut to this Entry</Title>
        <Text fz="xs">This will overwrite any existing entry for this shortcut.</Text>
      </Stack>
      <Group mt="md" position="center">
        <SegmentedControl size="md" data={options} />
        <Text fz="xs">
          You can customize these by navigating to chrome://extensions/shortcuts.
        </Text>
      </Group>
    </Paper>
  );
};
