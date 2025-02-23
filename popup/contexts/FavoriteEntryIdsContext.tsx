import { useAtomValue } from "jotai";
import { createContext, useContext, type PropsWithChildren } from "react";

import { favoriteEntryIdsAtom, refreshTokenAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

const FavoriteEntryIdsContext = createContext<Set<string>>(new Set());

export const FavoriteEntryIdsProvider = ({ children }: PropsWithChildren) => {
  const refreshToken = useAtomValue(refreshTokenAtom);
  const favoriteEntryIds = useAtomValue(favoriteEntryIdsAtom);
  const cloudFavoriteEntriesQuery = db.useQuery(
    refreshToken
      ? {
          entries: {
            $: {
              where: {
                isFavorited: true,
              },
            },
          },
        }
      : null,
  );
  const cloudFavoriteEntries = cloudFavoriteEntriesQuery.data?.entries || [];

  return (
    <FavoriteEntryIdsContext.Provider
      value={new Set([...favoriteEntryIds, ...cloudFavoriteEntries.map((entry) => entry.id)])}
    >
      {children}
    </FavoriteEntryIdsContext.Provider>
  );
};

export const useFavoriteEntryIds = () => {
  return useContext(FavoriteEntryIdsContext);
};
