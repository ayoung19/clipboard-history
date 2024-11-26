import { Box, Card, Group, rem, Text, useMantineTheme } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

import type { Entry } from "~types/entry";
import { defaultBorderColor } from "~utils/sx";

interface Props {
  entry: Entry;
  i: number;
  hidden?: boolean;
  grabbing?: boolean;
}

export const MergeItem = ({ entry, i, hidden = false, grabbing = false }: Props) => {
  const theme = useMantineTheme();

  return (
    <Box px={rem(4)}>
      <Card
        p={0}
        withBorder={grabbing}
        shadow={grabbing ? "md" : undefined}
        opacity={hidden ? 0 : undefined}
        sx={{ cursor: grabbing ? "grabbing" : "grab" }}
      >
        <Group align="center" spacing={0} noWrap px={rem(6)} h={32}>
          <Group align="center" mr="xs" pb={rem(1)}>
            <IconGripVertical size="0.8rem" color={defaultBorderColor(theme)} />
          </Group>
          <Text
            fz="xs"
            sx={{
              width: "100%",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              userSelect: "none",
            }}
          >
            <Text ff="monospace" color="dimmed" span>
              {i}.
            </Text>
            <> </>
            {/* Don't fully render large content. */}
            {entry.content.slice(0, 1000)}
          </Text>
        </Group>
      </Card>
    </Box>
  );
};
