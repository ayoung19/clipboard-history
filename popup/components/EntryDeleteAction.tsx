import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";

import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entryId: string;
}

export const EntryDeleteAction = ({ entryId }: Props) => {
  const favoriteEntryIdsSet = useFavoriteEntryIds();
  const isFavoriteEntry = favoriteEntryIdsSet.has(entryId);

  return (
    <ActionIcon
      sx={(theme) => commonActionIconSx({ theme, disabled: isFavoriteEntry })}
      onClick={(e) => {
        e.stopPropagation();

        if (!isFavoriteEntry) {
          deleteEntries([entryId]);
          modals.closeAll();
        }
      }}
    >
      <IconTrash size="1rem" />
    </ActionIcon>
  );
};
