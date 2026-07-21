import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { NoEntriesOverlay } from "~popup/components/NoEntriesOverlay";
import { useEntries } from "~popup/contexts/EntriesContext";
import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { searchAtom } from "~popup/states/atoms";

export const AllPage = () => {
  const reversedEntries = useEntries();
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useEntryIdToTags();

  return (
    <EntryList
      noEntriesOverlay={
        search.length === 0 ? (
          <NoEntriesOverlay
            title={chrome.i18n.getMessage("overlayEmptyTitle")}
            subtitle={chrome.i18n.getMessage("overlayEmptySubtitle")}
          />
        ) : (
          <NoEntriesOverlay title={chrome.i18n.getMessage("overlayNoResultsTitle", [search])} />
        )
      }
      entries={reversedEntries.filter(
        (entry) =>
          search.length === 0 ||
          entry.content.toLowerCase().includes(search.toLowerCase()) ||
          entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase())),
      )}
    />
  );
};
