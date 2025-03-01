import { ActionIcon } from "@mantine/core";
import { IconCloud, IconCloudFilled } from "@tabler/icons-react";

import { lightOrDark } from "~utils/sx";

interface Props {
  entryId: string;
}

export const EntryCloudAction = ({ entryId }: Props) => {
  const isCloudEntry = entryId.length === 36;

  return (
    <ActionIcon
      sx={(theme) => ({
        color: isCloudEntry ? theme.colors.cyan[5] : theme.colors.gray[5],
        ":hover": {
          color: isCloudEntry
            ? theme.colors.cyan[5]
            : lightOrDark(theme, theme.colors.gray[7], theme.colors.gray[3]),
          backgroundColor: lightOrDark(
            theme,
            theme.colors.indigo[1],
            theme.fn.darken(theme.colors.indigo[9], 0.3),
          ),
        },
      })}
      onClick={(e) => {
        e.stopPropagation();

        // TODO: Toggle between local and cloud.
      }}
    >
      {isCloudEntry ? <IconCloudFilled size="1rem" /> : <IconCloud size="1rem" />}
    </ActionIcon>
  );
};
