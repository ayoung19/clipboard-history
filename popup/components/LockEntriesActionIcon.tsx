import { ActionIcon } from "@mantine/core";
import { IconLockUp } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";

import { useModal } from "~popup/hooks/useModal";
import { keyAtom, lockedReversedEntriesAtom } from "~popup/state/atoms";
import { lockEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

import { CreateLockedItemsPasswordForm } from "./CreateLockedItemsPasswordForm";
import { GetLockedItemsPasswordForm } from "./GetLockedItemsPasswordForm";

interface Props {
  entryIds: string[];
  disabled?: boolean;
}

export const LockEntriesActionIcon = ({ entryIds, disabled }: Props) => {
  const { openModal } = useModal();

  const [key, setKey] = useAtom(keyAtom);
  const lockedReversedEntries = useAtomValue(lockedReversedEntriesAtom);

  return (
    <ActionIcon
      sx={(theme) => commonActionIconSx({ theme, disabled })}
      onClick={(e) => {
        e.stopPropagation();

        if (disabled) {
          return;
        }

        if (lockedReversedEntries.length === 0) {
          openModal(
            <CreateLockedItemsPasswordForm
              onSubmit={(newKey) => {
                setKey(newKey);
                lockEntries(entryIds, newKey);
              }}
            />,
          );
          return;
        }

        if (key !== undefined) {
          lockEntries(entryIds, key);
          return;
        }

        openModal(
          <GetLockedItemsPasswordForm
            onSubmit={(oldKey) => {
              setKey(oldKey);
              lockEntries(entryIds, oldKey);
            }}
          />,
        );
      }}
    >
      <IconLockUp size="1rem" />
    </ActionIcon>
  );
};
