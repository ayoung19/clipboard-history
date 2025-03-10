import { IconTrash } from "@tabler/icons-react";

import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { deleteEntries } from "~utils/storage";

import { CommonActionIcon } from "./CommonActionIcon";

interface Props {
  entryId: string;
}

export const EntryDeleteAction = ({ entryId }: Props) => {
  const favoriteEntryIdsSet = useFavoriteEntryIds();
  const isFavoriteEntry = favoriteEntryIdsSet.has(entryId);

  return (
    <CommonActionIcon disabled={isFavoriteEntry} onClick={() => deleteEntries([entryId])}>
      <IconTrash size="1rem" />
    </CommonActionIcon>
  );
};
