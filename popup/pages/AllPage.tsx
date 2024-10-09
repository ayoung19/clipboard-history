import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { entryIdToTagsAtom, reversedEntriesAtom, searchAtom } from "~popup/states/atoms";

export const AllPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  return (
    <EntryList
      consumer={"all"}
      entries={reversedEntries.filter(
        (entry) =>
          search.length === 0 ||
          entry.content.toLowerCase().includes(search.toLowerCase()) ||
          entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase())),
      )}
    />
  );
};
