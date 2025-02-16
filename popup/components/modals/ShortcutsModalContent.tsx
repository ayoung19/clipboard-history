import {
  CloseButton,
  Group,
  Kbd,
  Paper,
  SegmentedControl,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCopy, IconKeyboardOff } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { commandsAtom, entryCommandsAtom } from "~popup/states/atoms";
import { createEntryCommand, deleteEntryCommand } from "~storage/entryCommands";
import type { Entry } from "~types/entry";

interface Props {
  entry: Entry;
}

export const ShortcutsModalContent = ({ entry }: Props) => {
  const clipboard = useClipboard();
  const entryCommands = useAtomValue(entryCommandsAtom);
  const commands = useAtomValue(commandsAtom);

  console.log(commands);

  return (
    <Paper p="md">
      <Group align="center" position="apart" mb="xs">
        <Title order={5}>Assign Shortcut to Item</Title>
        <CloseButton onClick={() => modals.closeAll()} />
      </Group>
      <Text fz="xs" mb="xs">
        Assign a keyboard shortcut to this item. To customize shortcuts, visit
        <> </>
        <Tooltip label={<Text fz="xs">{clipboard.copied ? "Copied" : "Copy"}</Text>}>
          <UnstyledButton onClick={() => clipboard.copy("chrome://extensions/shortcuts")}>
            <Group align="center" spacing={4}>
              <Text fz="xs">chrome://extensions/shortcuts</Text>
              <IconCopy size="0.8rem" />
            </Group>
          </UnstyledButton>
        </Tooltip>
        .
      </Text>
      <Group align="center" position="center">
        <SegmentedControl
          size="md"
          value={
            entryCommands.find((entryCommand) => entryCommand.entryId === entry.id)?.commandName ||
            ""
          }
          onChange={(value) =>
            value.length === 0 ? deleteEntryCommand(entry.id) : createEntryCommand(entry.id, value)
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
      </Group>
    </Paper>
  );
};
