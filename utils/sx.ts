import type { MantineTheme } from "@mantine/core";

export const commonActionIconSx = ({
  theme,
  disabled,
}: {
  theme: MantineTheme;
  disabled?: boolean;
}) => ({
  color: disabled ? theme.colors.gray[3] : theme.colors.gray[5],
  cursor: disabled ? "not-allowed" : undefined,
  ":hover": {
    color: disabled ? theme.colors.gray[3] : theme.colors.gray[7],
    backgroundColor: disabled ? "inherit" : theme.colors.indigo[1],
  },
  ":active": {
    transform: disabled ? "none" : undefined,
  },
});
