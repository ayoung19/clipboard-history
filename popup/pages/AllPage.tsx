import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { reversedEntriesAtom, searchAtom } from "~popup/states/atoms";

export const AllPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const search = useAtomValue(searchAtom);

  return (
    <EntryList
      entries={reversedEntries.filter(
        (entry) =>
          search.length === 0 || entry.content.toLowerCase().includes(search.toLowerCase()),
      )}
    />
  );
};
