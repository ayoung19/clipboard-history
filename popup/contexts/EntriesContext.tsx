import { useAtomValue } from "jotai";
import { createContext, useContext, type PropsWithChildren } from "react";

import { entriesAtom, refreshTokenAtom } from "~popup/states/atoms";
import type { Entry } from "~types/entry";
import db from "~utils/db/react";

const EntriesContext = createContext<Entry[]>([]);

export const EntriesProvider = ({ children }: PropsWithChildren) => {
  const refreshToken = useAtomValue(refreshTokenAtom);
  const entries = useAtomValue(entriesAtom);
  const cloudEntriesQuery = db.useQuery(
    refreshToken
      ? {
          entries: {
            $: {
              order: {
                createdAt: "asc",
              },
            },
          },
        }
      : null,
  );
  const cloudEntries = cloudEntriesQuery.data?.entries || [];

  let i = entries.length - 1;
  let j = cloudEntries.length - 1;
  const out: Entry[] = [];

  while (i >= 0 && j >= 0) {
    const entry = entries[i]!;
    const cloudEntry = cloudEntries[j]!;

    if (entry.createdAt > cloudEntry.createdAt) {
      out.push(entry);
      i--;
    } else {
      out.push(cloudEntry);
      j--;
    }
  }

  while (i >= 0) {
    const entry = entries[i]!;
    out.push(entry);
    i--;
  }

  while (j >= 0) {
    const cloudEntry = cloudEntries[j]!;
    out.push(cloudEntry);
    j--;
  }

  return <EntriesContext.Provider value={out}>{children}</EntriesContext.Provider>;
};

export const useEntries = () => {
  return useContext(EntriesContext);
};
