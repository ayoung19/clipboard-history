import { ActionIcon } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";
import { lightOrDark } from "~utils/sx";

interface Props {
  entryId: string;
}

export const EntryFavoriteAction = ({ entryId }: Props) => {
  const favoriteEntryIdsSet = useFavoriteEntryIds();
  const isFavoriteEntry = favoriteEntryIdsSet.has(entryId);

  return (
    <ActionIcon
      sx={(theme) => ({
        color: isFavoriteEntry ? theme.colors.yellow[5] : theme.colors.gray[5],
        ":hover": {
          color: isFavoriteEntry
            ? theme.colors.yellow[5]
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

        if (isFavoriteEntry) {
          deleteFavoriteEntryIds([entryId]);
        } else {
          addFavoriteEntryIds([entryId]);
        }
      }}
    >
      {isFavoriteEntry ? <IconStarFilled size="1rem" /> : <IconStar size="1rem" />}
    </ActionIcon>
  );
};
