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
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          height: 450,
          width: 700,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {search.length !== 0 ? (
          <>
            <Text size="xl" style={{ color: "#a1a1a1" }}>
              No matches found for "{search}"
            </Text>
          </>
        ) : (
          <>
            <Text size="xl" style={{ color: "#a1a1a1" }}>
              Your clipboard history is empty
            </Text>
            <Text size="sm" c="gray">
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
