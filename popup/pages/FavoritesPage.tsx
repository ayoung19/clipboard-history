import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import {
  entryIdToTagsAtom,
  favoriteEntryIdsSetAtom,
  reversedEntriesAtom,
  searchAtom,
} from "~popup/states/atoms";

export const FavoritesPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const favoriteEntryIdsSet = useAtomValue(favoriteEntryIdsSetAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  return (
    <EntryList
      entries={reversedEntries.filter(
        (entry) =>
          favoriteEntryIdsSet.has(entry.id) &&
          (search.length === 0 ||
            entry.content.toLowerCase().includes(search.toLowerCase()) ||
            entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase()))),
      )}
    />
  );
};
