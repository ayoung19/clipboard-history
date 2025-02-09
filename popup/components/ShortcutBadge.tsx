import { Badge } from "@mantine/core";
import { modals } from "@mantine/modals";

import { ShortcutsModalContent } from "~popup/components/modals/ShortcutsModalContent";
import type { Entry } from "~types/entry";

interface Props {
  formattedShortcut: string;
  entry: Entry;
}

export const ShortcutBadge = ({ entry, formattedShortcut }: Props) => {
  return (
    <Badge
      variant="filled"
      sx={{ flexShrink: 0, userSelect: "none" }}
      size="xs"
      onClick={() => {
        modals.open({
          padding: 0,
          size: "xl",
          withCloseButton: false,
          children: <ShortcutsModalContent selectedEntry={entry} />,
        });
      }}
    >
      {formattedShortcut}
    </Badge>
  );
};
