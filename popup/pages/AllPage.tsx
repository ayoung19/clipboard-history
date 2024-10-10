import { Stack, Text } from "@mantine/core";
import { useAtomValue } from "jotai";

import { EntryList } from "~popup/components/EntryList";
import { entryIdToTagsAtom, reversedEntriesAtom, searchAtom } from "~popup/states/atoms";

export const AllPage = () => {
  const reversedEntries = useAtomValue(reversedEntriesAtom);
  const search = useAtomValue(searchAtom);
  const entryIdToTags = useAtomValue(entryIdToTagsAtom);

  const renderNoEntriesOverlay = () => {
    return (
      <Stack h={450} w={700} justify="center" align="center">
        {search.length !== 0 ? (
          <>
            <Text size="xl" color="dimmed">
              No matches found for "{search}"
            </Text>
          </>
        ) : (
          <>
            <Text size="xl" color="dimmed">
              Your clipboard history is empty
            </Text>
            <Text size="sm" color="dimmed">
              Copy any text to see it here
            </Text>
          </>
        )}
      </Stack>
    );
  };

  return (
    <EntryList
      noEntriesOverlay={renderNoEntriesOverlay()}
      entries={reversedEntries.filter(
        (entry) =>
          search.length === 0 ||
          entry.content.toLowerCase().includes(search.toLowerCase()) ||
          entryIdToTags[entry.id]?.some((tag) => tag.includes(search.toLowerCase())),
      )}
    />
  );
};
