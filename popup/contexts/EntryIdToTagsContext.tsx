import { useAtomValue } from "jotai";
import { createContext, useContext, type PropsWithChildren } from "react";
import { z } from "zod";

import { useCloudTaggedEntriesQuery } from "~popup/hooks/useCloudTaggedEntriesQuery";
import { entryIdToTagsAtom } from "~popup/states/atoms";
import type { EntryIdToTags } from "~types/entryIdToTags";

const EntryIdToTagsContext = createContext<EntryIdToTags>({});

export const EntryIdToTagsProvider = ({ children }: PropsWithChildren) => {
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);
  const cloudTaggedEntriesQuery = useCloudTaggedEntriesQuery();
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
