import { ActionIcon, Group } from "@mantine/core";
import { IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";

import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import type { Entry } from "~types/entry";
import { deleteEntries } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entry: Entry;
  favoriteEntryIds: string[];
}

export const EntryActions = ({ entry, favoriteEntryIds }: Props) => {
  const isFavoriteEntry = favoriteEntryIds.includes(entry.id);

  return (
    <Group align="center" spacing={0} noWrap>
      <ActionIcon
        sx={(theme) => ({
          color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[5],
          ":hover": {
            color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[7],
            backgroundColor: theme.colors.indigo[1],
          },
        })}
        onClick={(e) => {
          e.stopPropagation();

          isFavoriteEntry ? deleteFavoriteEntryIds([entry.id]) : addFavoriteEntryIds([entry.id]);
        }}
      >
        {isFavoriteEntry ? <IconStarFilled size="1rem" /> : <IconStar size="1rem" />}
      </ActionIcon>
      <ActionIcon
        sx={(theme) => commonActionIconSx({ theme, disabled: isFavoriteEntry })}
        onClick={(e) => {
          e.stopPropagation();

          if (!isFavoriteEntry) {
            deleteEntries([entry.id]);
          }
        }}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  );
};
