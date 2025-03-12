import { max } from "date-fns";
import { useAtomValue } from "jotai";

import { useEntries } from "~popup/contexts/EntriesContext";
import { staticNowAtom } from "~popup/states/atoms";

export const useNow = () => {
  const entries = useEntries();
  const staticNow = useAtomValue(staticNowAtom);

  return max([new Date(entries[0]?.createdAt || 0), staticNow]);
};
