import { useAtomValue } from "jotai";
import { createContext, useContext, type PropsWithChildren } from "react";
import { z } from "zod";

import { entryIdToTagsAtom, refreshTokenAtom } from "~popup/states/atoms";
import type { EntryIdToTags } from "~types/entryIdToTags";
import db from "~utils/db/react";

const EntryIdToTagsContext = createContext<EntryIdToTags>({});

export const EntryIdToTagsProvider = ({ children }: PropsWithChildren) => {
  const refreshToken = useAtomValue(refreshTokenAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);
  const cloudTaggedEntriesQuery = db.useQuery(
    refreshToken
      ? {
          entries: {
            $: {
              where: {
                tags: {
                  $isNull: false,
                },
              },
            },
          },
        }
      : null,
  );
  const cloudTaggedEntries = cloudTaggedEntriesQuery.data?.entries || [];

  return (
    <EntryIdToTagsContext.Provider
      value={{
        ...entryIdToTags,
        ...cloudTaggedEntries.reduce<EntryIdToTags>((acc, curr) => {
          acc[curr.id] = z
            .array(z.string())
            .catch([])
            .parse(JSON.parse(curr.tags || "[]"));

          return acc;
        }, {}),
      }}
    >
      {children}
    </EntryIdToTagsContext.Provider>
  );
};

export const useEntryIdToTags = () => {
  return useContext(EntryIdToTagsContext);
};
