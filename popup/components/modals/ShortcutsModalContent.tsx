import {
  Button,
  CloseButton,
  Group,
  Kbd,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import {useEffect, useState} from "react";

import type { Entry } from "~types/entry";
import type { ShortcutStore } from "~types/shortcut";
import { getShortcuts, setShortcuts } from "~utils/storage/shortcuts";

interface Props {
  selectedEntry: Entry;
}

export const ShortcutsModalContent = ({ selectedEntry }: Props) => {
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const shortcutsQuery = useQuery({
    queryKey: ["shortcutsQuery"],
    queryFn: getShortcuts,
  });
  const shortcutsMutation = useMutation({
    mutationFn: setShortcuts,
  });

  useEffect(() => {
    if (shortcutsQuery.data) {
      // Find shortcut already assigned to this entry
      const existingShortcut = Object.entries(shortcutsQuery.data).find(
          ([, shortcutObject]) => shortcutObject.entryId === selectedEntry.id
      );

      if (existingShortcut) {
        setSelectedShortcut(existingShortcut[0]); // Set commandName as initial value
      }
    }
  }, [shortcutsQuery.data, selectedEntry.id]);

  if (!shortcutsQuery || !shortcutsQuery.data) {
    return <Title order={5}>Shortcuts not enabled for this extension.</Title>;
  }

  const formatShortcut = (shortcut: string) => {
    const keys = shortcut.split("");

    return (
      <>
        {keys.map((key, index) => (
          <span key={index}>
            <Kbd>{key.trim()}</Kbd>
            {index < keys.length - 1 && " + "}
          </span>
        ))}
      </>
    );
  };

  const mapShortcutStoreToOptions = (shortcutStore: ShortcutStore) => {
    return Object.entries(shortcutStore).map(([commandName, shortcutObject]) => ({
      label: formatShortcut(shortcutObject.shortcut),
      value: commandName,
    }));
  };

  const shortcutOptions = mapShortcutStoreToOptions(shortcutsQuery.data ?? {});

  const assignEntryToShortcut = () => {
    const shortcutStore = shortcutsQuery.data;
    if (!shortcutStore) return;

    const shortcutToUpdate = shortcutStore[selectedShortcut];
    if (!shortcutToUpdate) return;

    const updatedShortcutStore = {
      ...shortcutStore,
      [selectedShortcut]: {
        ...shortcutToUpdate,
        entryId: selectedEntry.id,
      },
    };

    shortcutsMutation.mutate(updatedShortcutStore);
  };

  const handleSave = () => {
    assignEntryToShortcut();
    modals.closeAll()
  }

  return (
    <Paper p="md">
      <Stack spacing={0}>
        <Group align="center" position="apart" mb="xs">
          <Title order={5}>Assign a Shortcut to this Entry</Title>
          <CloseButton onClick={() => modals.closeAll()} />
        </Group>
        <Text fz="xs">This will overwrite any existing entry assigned to the shortcut.</Text>
      </Stack>
      <Group mt="md" position="center">
        <SegmentedControl
          value={selectedShortcut}
          onChange={setSelectedShortcut}
          data={shortcutOptions}
        />
        <Text fz="xs">
          You can customize these options by navigating to <code>chrome://extensions/shortcuts</code>
        </Text>
        <Button
          size="xs"
          fullWidth
          disabled={selectedShortcut === ""}
          onClick={handleSave}
        >
          Save
        </Button>
      </Group>
    </Paper>
  );
};
