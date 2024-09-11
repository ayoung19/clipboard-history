import { ActionIcon } from "@mantine/core";
import { IconLockX } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { keyAtom } from "~popup/state/atoms";
import { unlockEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entryIds: string[];
  disabled?: boolean;
}

export const UnlockEntriesActionIcon = ({ entryIds, disabled }: Props) => {
  const key = useAtomValue(keyAtom);

  return (
    <ActionIcon
      sx={(theme) => commonActionIconSx({ theme, disabled })}
      onClick={(e) => {
        e.stopPropagation();

        if (disabled) {
          return;
        }

        if (key !== undefined) {
          unlockEntries(entryIds, key);
        }
      }}
    >
      <IconLockX size="1rem" />
    </ActionIcon>
  );
};
