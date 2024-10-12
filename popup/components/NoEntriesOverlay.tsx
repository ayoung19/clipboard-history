import { Stack, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import type { ReactElement } from "react";

import { searchAtom } from "~popup/states/atoms";

const NoEntriesOverlay = (title: string, subtitle: ReactElement | string) => {
  const search = useAtomValue(searchAtom);

  return (
    <Stack align="center">
      {search.length !== 0 ? (
        <>
          <Text size="xl" color="dimmed">
            No matches found for "{search}"
          </Text>
        </>
      ) : (
        <>
          <Text size="xl" color="dimmed">
            {title}
          </Text>
          <Text size="sm" color="dimmed">
            {subtitle}
          </Text>
        </>
      )}
    </Stack>
  );
};

export default NoEntriesOverlay;
