import { Badge, useMantineTheme } from "@mantine/core";

import { useSubscriptionsQuery } from "~popup/hooks/useSubscriptionsQuery";
import db from "~utils/db/react";
import { lightOrDark } from "~utils/sx";

export const ProBadge = () => {
  const theme = useMantineTheme();

  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const subscriptionsQuery = useSubscriptionsQuery();

  if (subscriptionsQuery.data?.subscriptions.length && connectionStatus !== "closed") {
    return (
      <Badge size="xs" color="cyan">
        Pro
      </Badge>
    );
  }

  if (auth.user && connectionStatus === "closed") {
    return (
      <Badge
        size="xs"
        color={lightOrDark(theme, "dark", "gray")}
        variant={lightOrDark(theme, "light", "filled")}
      >
        Offline
      </Badge>
    );
  }

  return null;
};
