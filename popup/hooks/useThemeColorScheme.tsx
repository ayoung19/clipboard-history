import { useColorScheme } from "@mantine/hooks";
import { useAtomValue } from "jotai";

import { settingsAtom } from "~popup/states/atoms";

export const useThemeColorScheme = () => {
  const settings = useAtomValue(settingsAtom);
  const systemColorScheme = useColorScheme();

  switch (settings.themeV2) {
    case "light":
    case "dark":
      return settings.themeV2;
  }

  return systemColorScheme;
};
