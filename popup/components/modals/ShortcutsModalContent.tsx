import {
  CloseButton,
  Group,
  Paper,
  SegmentedControl,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
  IconCopy,
  IconKeyboardOff,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { match } from "ts-pattern";

import { commandsAtom, entryCommandsAtom } from "~popup/states/atoms";
import { createEntryCommand, deleteEntryCommands } from "~storage/entryCommands";
import type { Entry } from "~types/entry";

interface Props {
  entry: Entry;
}

export const ShortcutsModalContent = ({ entry }: Props) => {
  const clipboard = useClipboard();

  const entryCommands = useAtomValue(entryCommandsAtom);
  const commands = useAtomValue(commandsAtom);

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
          value={
            entryCommands.find((entryCommand) => entryCommand.entryId === entry.id)?.commandName ||
            ""
          }
          onChange={(value) =>
            value.length === 0
              ? deleteEntryCommands([entry.id])
              : createEntryCommand(entry.id, value)
          }
          data={[
            ...commands
              .filter((command) => command.name.startsWith("paste-item"))
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((command) => ({
                label: (
                  <Group align="center" spacing={8} noWrap>
                    {match(command.name)
                      .with("paste-item-1", () => <IconCircleNumber1 size="1.125rem" />)
                      .with("paste-item-2", () => <IconCircleNumber2 size="1.125rem" />)
                      .with("paste-item-3", () => <IconCircleNumber3 size="1.125rem" />)
                      .otherwise(() => null)}
                    <Text>{command.shortcut || "Not set"}</Text>
                  </Group>
                ),
                value: command.name,
              })),
            {
              label: (
                <Group align="center" noWrap h="100%">
                  <IconKeyboardOff size="1.125rem" />
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
