import { modals } from "@mantine/modals";

import { ErrorModalContent } from "~popup/components/modals/ErrorModalContent";

export const handleMutation = <T,>(cb: () => Promise<T>) => {
  return async () => {
    try {
      return await cb();
    } catch (e) {
      modals.closeAll();

      modals.open({
        padding: 0,
        size: "xl",
        withCloseButton: false,
        children: <ErrorModalContent err={e} />,
      });

      throw e;
    }
  };
};
