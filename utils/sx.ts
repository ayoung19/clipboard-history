import type { MantineTheme } from "@mantine/core";

export const commonActionIconSx = ({
  theme,
  disabled,
}: {
  theme: MantineTheme;
  disabled?: boolean;
}) => ({
  color: disabled ? defaultBorderColor(theme) : theme.colors.gray[5],
  cursor: disabled ? "not-allowed" : undefined,
  ":hover": {
    color: disabled ? defaultBorderColor(theme) : theme.colors.gray[7],
    backgroundColor: disabled ? "inherit" : theme.colors.indigo[1],
  },
  ":active": {
    transform: disabled ? "none" : undefined,
  },
});

export const defaultBorderColor = (theme: MantineTheme) =>
  theme.colorScheme === "light" ? theme.colors.gray[3] : theme.colors.dark[4];
