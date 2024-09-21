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
    color: disabled
      ? defaultBorderColor(theme)
      : lightOrDark(theme, theme.colors.gray[7], theme.colors.gray[3]),
    backgroundColor: disabled
      ? "inherit"
      : lightOrDark(theme, theme.colors.indigo[1], theme.fn.darken(theme.colors.indigo[9], 0.3)),
  },
  ":active": {
    transform: disabled ? "none" : undefined,
  },
});

export const defaultBorderColor = (theme: MantineTheme) =>
  theme.colorScheme === "light" ? theme.colors.gray[3] : theme.colors.dark[4];

export const lightOrDark = (theme: MantineTheme, light: string, dark: string) =>
  theme.colorScheme === "light" ? light : dark;
