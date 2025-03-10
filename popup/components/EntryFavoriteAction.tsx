import { useMantineTheme } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { useFavoriteEntryIds } from "~popup/contexts/FavoriteEntryIdsContext";
import { addFavoriteEntryIds, deleteFavoriteEntryIds } from "~storage/favoriteEntryIds";

import { CommonActionIcon } from "./CommonActionIcon";

interface Props {
  entryId: string;
}

export const EntryFavoriteAction = ({ entryId }: Props) => {
  const theme = useMantineTheme();
  const favoriteEntryIdsSet = useFavoriteEntryIds();
  const isFavoriteEntry = favoriteEntryIdsSet.has(entryId);

  return (
    <CommonActionIcon
      color={isFavoriteEntry ? theme.colors.yellow[5] : undefined}
      hoverColor={isFavoriteEntry ? theme.colors.yellow[5] : undefined}
      onClick={() =>
        isFavoriteEntry ? deleteFavoriteEntryIds([entryId]) : addFavoriteEntryIds([entryId])
      }
    >
      {isFavoriteEntry ? <IconStarFilled size="1rem" /> : <IconStar size="1rem" />}
    </CommonActionIcon>
  );
};
