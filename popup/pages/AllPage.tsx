import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import NoEntriesOverlay from "~popup/components/NoEntriesOverlay";
import { entryIdToTagsAtom, reversedEntriesAtom, searchAtom } from "~popup/states/atoms";

export const AllPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  return (
    <EntryList
      noEntriesOverlay={NoEntriesOverlay(
        "Your clipboard history is empty",
        "Copy any text to see it here",
      )}
      entries={reversedEntries.filter(
        (entry) =>
          search.length === 0 ||
          entry.content.toLowerCase().includes(search.toLowerCase()) ||
          entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase())),
      )}
    />
  );
};
