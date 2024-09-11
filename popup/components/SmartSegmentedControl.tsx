import { Group, SegmentedControl, Text } from "@mantine/core";
import { IconClipboardList, IconLock, IconStar } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";

import { useModal } from "~popup/hooks/useModal";
import { keyAtom, lockedReversedEntriesAtom, pageAtom } from "~popup/state/atoms";
import { Page } from "~types/page";

import { GetLockedItemsPasswordForm } from "./GetLockedItemsPasswordForm";

export const SmartSegmentedControl = () => {
  const { openModal } = useModal();

  const [page, setPage] = useAtom(pageAtom);
  const [key, setKey] = useAtom(keyAtom);

  const lockedReversedEntries = useAtomValue(lockedReversedEntriesAtom);

  return (
    <SegmentedControl
      value={page}
      onChange={(newPage: Page) => {
        if (newPage !== Page.Locked || lockedReversedEntries.length === 0 || key !== undefined) {
          setPage(newPage);
          return;
        }

        openModal(
          <GetLockedItemsPasswordForm
            onSubmit={(oldKey) => {
              setKey(oldKey);
              setPage(newPage);
            }}
          />,
        );
      }}
      size="xs"
      color={page === Page.All ? "indigo.4" : page === Page.Favorites ? "yellow.5" : "gray.7"}
      data={[
        {
          label: (
            <Group align="center" spacing={4} noWrap>
              <IconClipboardList size="1rem" />
              <Text>All</Text>
            </Group>
          ),
          value: Page.All,
        },
        {
          label: (
            <Group align="center" spacing={4} noWrap>
              <IconStar size="1rem" />
              <Text>Favorites</Text>
            </Group>
          ),
          value: Page.Favorites,
        },
        {
          label: (
            <Group align="center" spacing={4} noWrap>
              <IconLock size="1rem" />
              <Text>Locked</Text>
            </Group>
          ),
          value: Page.Locked,
        },
      ]}
    />
  );
};
