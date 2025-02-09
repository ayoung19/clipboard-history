import {
  Button,
  Center,
  CloseButton,
  Group,
  Kbd,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  type SegmentedControlItem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconKeyboardOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { shortcutsAtom } from "~popup/states/atoms";
import { setShortcuts } from "~storage/shortcuts";
import type { Entry } from "~types/entry";
import type { CommandNameToShortcut } from "~types/shortcut";

interface Props {
  selectedEntry: Entry;
}

export const ShortcutsModalContent = ({ selectedEntry }: Props) => {
  const [selectedShortcutKey, setSelectedShortcutKey] = useState("");
  const [shortcuts, setShortcutsAtom] = useAtom(shortcutsAtom);

  const shortcutsMutation = useMutation({
    mutationFn: setShortcuts,
    onMutate: async (newShortcuts) => {
      setShortcutsAtom(newShortcuts);
      modals.closeAll();
    },
  });

  const existingShortcutEntry = useMemo(() => {
    return Object.entries(shortcuts).find(
      ([, shortcutObject]) => shortcutObject.entryId === selectedEntry.id,
    );
  }, [shortcuts, selectedEntry.id]);

  useEffect(() => {
    if (existingShortcutEntry) setSelectedShortcutKey(existingShortcutEntry[0]);
  }, [existingShortcutEntry]);

  if (!shortcuts) {
    return <Title order={5}>Shortcuts not enabled for this extension.</Title>;
  }

  const formatShortcut = (shortcut: string) => {
    const keys = shortcut.split("");

    return (
      <Center h="30px">
        {keys.map((key, index) => (
          <span key={index}>
            <Kbd>{key.trim()}</Kbd>
            {index < keys.length - 1 && " + "}
          </span>
        ))}
      </Center>
    );
  };

  const mapShortcutStoreToOptions = (
    shortcutStore: CommandNameToShortcut,
  ): SegmentedControlItem[] => {
    const options = Object.entries(shortcutStore).map(([commandName, shortcutObject]) => ({
      label: formatShortcut(shortcutObject.shortcut),
      value: commandName,
    }));
    options.push({
      label: (
        <Center h="30px">
          <IconKeyboardOff />
        </Center>
      ),
      value: "",
    });
    return options;
  };

  const removeExistingShortcut = (updatedShortcuts: CommandNameToShortcut) => {
    if (existingShortcutEntry) {
      updatedShortcuts[existingShortcutEntry[0]] = {
        ...existingShortcutEntry[1],
        entryId: undefined,
      };
    }
  };

  const assignEntryToShortcut = (updatedShortcuts: CommandNameToShortcut) => {
    const shortcutToUpdate = updatedShortcuts[selectedShortcutKey];
    if (shortcutToUpdate) {
      updatedShortcuts[selectedShortcutKey] = {
        ...shortcutToUpdate,
        entryId: selectedEntry.id,
      };
    }
  };

  const handleSave = () => {
    const updatedShortcutStore = { ...shortcuts };

    removeExistingShortcut(updatedShortcutStore);
    assignEntryToShortcut(updatedShortcutStore);

    shortcutsMutation.mutate(updatedShortcutStore);
  };

  return (
    <Paper p="md">
      <Stack spacing="xs">
        <Stack spacing={0}>
          <Group align="center" position="apart" mb="xs">
            <Title order={5}>Assign a Shortcut to this Entry</Title>
            <CloseButton onClick={() => modals.closeAll()} />
          </Group>
          <Text fz="xs">This will overwrite any existing entry assigned to the shortcut.</Text>
        </Stack>

        <Stack align="center" spacing="xs">
          <SegmentedControl
            value={selectedShortcutKey}
            onChange={setSelectedShortcutKey}
            data={mapShortcutStoreToOptions(shortcuts)}
          />
          <Text fz="xs">
            You can customize these options by navigating to{" "}
            <code>chrome://extensions/shortcuts</code>
          </Text>
        </Stack>

        <Group align="end" position="right" spacing="xs">
          <Button size="xs" variant="subtle" onClick={() => setSelectedShortcutKey("")}>
            Reset
          </Button>
          <Button size="xs" onClick={handleSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
