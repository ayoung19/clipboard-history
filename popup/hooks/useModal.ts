import { useSetAtom } from "jotai";
import type { ReactNode } from "react";

import { modalAtom } from "~popup/state/atoms";

export const useModal = () => {
  const setModalAtom = useSetAtom(modalAtom);

  return {
    openModal: (modalContent: ReactNode) => setModalAtom({ opened: true, modalContent }),
    closeModal: () => {
      setModalAtom((prevState) => ({ ...prevState, opened: false }));
      setTimeout(() => setModalAtom((prevState) => ({ ...prevState, modalContent: null })), 200);
    },
  };
};
