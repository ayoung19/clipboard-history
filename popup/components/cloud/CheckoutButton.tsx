import { Button } from "@mantine/core";

import db from "~utils/db/react";
import env from "~utils/env";

export const CheckoutButton = () => {
  const auth = db.useAuth();

  if (!auth.user) {
    return null;
  }

  return (
    <Button
      size="xs"
      mt="xs"
      component="a"
      href={`${env.BASE_URL}/checkout/${auth.user.id}`}
      target="_blank"
    >
      Start Free Trial / Manage Subscription
    </Button>
  );
};
