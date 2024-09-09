import { Box } from "@mantine/core";
import { FixedSizeList } from "react-window";

import type { Entry } from "~types/entry";

import { EntryRow } from "./EntryRow";

interface Props {
  entries: Entry[];
  clipboardContent?: string;
  selectedEntryIds: Set<string>;
  favoriteEntryIdsSet: Set<string>;
  onEntryClick: (entry: Entry) => void;
}

export const EntryList = ({
  entries,
  clipboardContent,
  selectedEntryIds,
  favoriteEntryIdsSet,
  onEntryClick,
}: Props) => {
  return (
    <FixedSizeList height={500} itemCount={entries.length} itemSize={37} width={700}>
      {({ index, style }) => (
        <Box style={style}>
          <EntryRow
            entry={entries[index]!}
            clipboardContent={clipboardContent}
            selectedEntryIds={selectedEntryIds}
            favoriteEntryIdsSet={favoriteEntryIdsSet}
            onEntryClick={onEntryClick}
          />
        </Box>
      )}
    </FixedSizeList>
  );
};
