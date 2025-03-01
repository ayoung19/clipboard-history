import { createContext, useContext, type PropsWithChildren } from "react";

import { entryIdToTagsToAllTags } from "~utils/entryIdToTags";

import { useEntryIdToTags } from "./EntryIdToTagsContext";

const AllTagsContext = createContext<string[]>([]);

export const AllTagsProvider = ({ children }: PropsWithChildren) => {
  const entryIdToTags = useEntryIdToTags();

  return (
    <AllTagsContext.Provider value={entryIdToTagsToAllTags(entryIdToTags)}>
      {children}
    </AllTagsContext.Provider>
  );
};

export const useAllTags = () => {
  return useContext(AllTagsContext);
};
