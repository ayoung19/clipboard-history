import { createHash } from "crypto";
import { ActionIcon, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCloud, IconCloudFilled } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useMemo } from "react";

import { useEntries } from "~popup/contexts/EntriesContext";
import { transitioningEntryContentHashAtom } from "~popup/states/atoms";
import type { Entry } from "~types/entry";
import db from "~utils/db/react";
import { toggleEntryStorageLocation } from "~utils/storage";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  entry: Entry;
}

export const EntryCloudAction = ({ entry }: Props) => {
  const auth = db.useAuth();
  const entries = useEntries();
  const [transitioningEntryContentHash, setTransitioningEntryContentHash] = useAtom(
    transitioningEntryContentHashAtom,
  );
  const contentHash = useMemo(
    () => createHash("sha256").update(entry.content).digest("hex"),
    [entry.content],
  );
  const isCloudEntry = entry.id.length === 36;

  if (!auth.user) {
    return null;
  }

  return (
    <ActionIcon
      sx={(theme) =>
        commonActionIconSx({
          theme,
          disabled: transitioningEntryContentHash !== undefined,
          color: isCloudEntry ? theme.colors.cyan[5] : undefined,
          hoverColor: isCloudEntry ? theme.colors.cyan[5] : undefined,
        })
      }
      onClick={(e) => {
        e.stopPropagation();

        if (transitioningEntryContentHash !== undefined) {
          return;
        }

        if (entries.filter((e) => e.content === entry.content).length > 1) {
          notifications.show({
            color: "red",
            title: "Error",
            message: isCloudEntry
              ? "A copy of this item is already stored locally."
              : "A copy of this item is already stored in the cloud.",
          });

          return;
        }

        setTransitioningEntryContentHash(contentHash);

        toggleEntryStorageLocation(entry.id);
      }}
    >
      {transitioningEntryContentHash === contentHash ? (
        <Loader size="xs" variant="dots" />
      ) : isCloudEntry ? (
        <IconCloudFilled size="1rem" />
      ) : (
        <IconCloud size="1rem" />
      )}
    </ActionIcon>
  );
};
