import { ActionIcon } from "@mantine/core";
import { useAtomValue } from "jotai";
import { forwardRef, type PropsWithChildren } from "react";

import { transitioningEntryContentHashAtom } from "~popup/states/atoms";
import { commonActionIconSx } from "~utils/sx";

interface Props {
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  hoverColor?: string;
  onClick?: () => void;
}

export const CommonActionIcon = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  ({ disabled, color, backgroundColor, hoverColor, onClick, children }, ref) => {
    const transitioningEntryContentHash = useAtomValue(transitioningEntryContentHashAtom);

    const isDisabled = disabled || transitioningEntryContentHash !== undefined;

    return (
      <ActionIcon
        ref={ref}
        sx={(theme) =>
          commonActionIconSx({
            theme,
            disabled: isDisabled,
            color: color,
            backgroundColor: backgroundColor,
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
  },
);
