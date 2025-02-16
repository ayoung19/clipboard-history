import {
  Anchor,
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
import { IconKeyboardOff } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { commandsAtom, entryCommandsAtom } from "~popup/states/atoms";
import { createEntryCommand, deleteEntryCommand } from "~storage/entryCommands";
import type { Entry } from "~types/entry";

interface Props {
  entry: Entry;
}

export const ShortcutsModalContent = ({ entry }: Props) => {
  const entryCommands = useAtomValue(entryCommandsAtom);
  const commands = useAtomValue(commandsAtom);

  console.log(commands);

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
            size="md"
            value={
              entryCommands.find((entryCommand) => entryCommand.entryId === entry.id)
                ?.commandName || ""
            }
            onChange={(value) =>
              value.length === 0
                ? deleteEntryCommand(entry.id)
                : createEntryCommand(entry.id, value)
            }
            data={[
              ...commands
                .filter((command) => command.name.startsWith("paste-item"))
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((command) => ({
                  label: command.shortcut ? (
                    <Group align="center" spacing={4} noWrap>
                      {command.shortcut.split("").map((c, i) => (
                        <>
                          {i > 0 && <>+</>}
                          <Kbd>{c}</Kbd>
                        </>
                      ))}
                    </Group>
                  ) : (
                    <Group align="center" noWrap>
                      <Kbd>Not set</Kbd>
                    </Group>
                  ),
                  value: command.name,
                })),
              {
                label: (
                  <Group align="center" noWrap h="100%">
                    <IconKeyboardOff />
                  </Group>
                ),
                value: "",
              },
            ]}
            sx={{
              ".mantine-SegmentedControl-label": {
                height: "100%",
              },
            }}
          />
          <Text fz="xs">
            You can customize these options by navigating to{" "}
            <Anchor href="chrome://extensions/shortcuts" target="_blank">
              chrome://extensions/shortcuts
            </Anchor>
          </Text>
        </Stack>

        {/* <Group align="end" position="right" spacing="xs">
          <Button size="xs" variant="subtle" onClick={() => setSelectedShortcutKey("")}>
            Reset
          </Button>
          <Button size="xs" onClick={handleSave}>
            Save
          </Button>
        </Group> */}
      </Stack>
    </Paper>
  );
};
