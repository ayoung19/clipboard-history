import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { favoriteEntryIdsSetAtom } from "~popup/states/atoms";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entryId: string;
}

export const EntryDeleteAction = ({ entryId }: Props) => {
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const isFavoriteEntry = favoriteEntryIdsSet.has(entryId);
  
  return (
    <ActionIcon
      sx={(theme) => commonActionIconSx({ theme, disabled: isFavoriteEntry })}
      onClick={(e) => {
        e.stopPropagation();

        if (!isFavoriteEntry) {
          deleteEntries([entryId]);
        }
      }}
    >
    <IconTrash size="1rem" />
  </ActionIcon>
  );
};
