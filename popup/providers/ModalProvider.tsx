import { Modal } from "@mantine/core";
import { useAtomValue } from "jotai";
import { type ReactNode } from "react";

import { useModal } from "~popup/hooks/useModal";
import { modalAtom } from "~popup/state/atoms";

interface Props {
  children: ReactNode;
}

export const ModalProvider = ({ children }: Props) => {
  const { opened, modalContent } = useAtomValue(modalAtom);
  const { closeModal } = useModal();

  return (
    <>
      <Modal opened={opened} onClose={closeModal} withCloseButton={false} centered>
        {modalContent}
      </Modal>
      {children}
    </>
  );
};
