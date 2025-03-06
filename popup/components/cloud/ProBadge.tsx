import { Badge } from "@mantine/core";
import { useAtomValue } from "jotai";

import { refreshTokenAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

export const ProBadge = () => {
  const refreshToken = useAtomValue(refreshTokenAtom);

  const subscriptionsQuery = db.useQuery(
    refreshToken
      ? {
          subscriptions: {},
        }
      : null,
  );

  if (!subscriptionsQuery.data?.subscriptions.length) {
    return null;
  }

  return (
    <Badge size="xs" color="cyan">
      Pro
    </Badge>
  );
};
