import { ActionIcon } from "@mantine/core";
import { useAtomValue } from "jotai";
import { type PropsWithChildren } from "react";

import { transitioningEntryContentHashAtom } from "~popup/states/atoms";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  disabled?: boolean;
  color?: string;
  hoverColor?: string;
  onClick?: () => void;
}

export const CommonActionIcon = ({
  disabled,
  color,
  hoverColor,
  onClick,
  children,
}: PropsWithChildren<Props>) => {
  const transitioningEntryContentHash = useAtomValue(transitioningEntryContentHashAtom);

  const isDisabled = disabled || transitioningEntryContentHash !== undefined;

  return (
    <ActionIcon
      sx={(theme) =>
        commonActionIconSx({
          theme,
          disabled: isDisabled,
          color: color,
          hoverColor: hoverColor,
        })
      }
      onClick={(e) => {
        e.stopPropagation();

        if (isDisabled || onClick === undefined) {
          return;
        }

        onClick();
      }}
    >
      {children}
    </ActionIcon>
  );
};
