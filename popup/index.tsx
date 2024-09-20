import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { App } from "./App";
import { settingsAtom } from "./states/atoms";

const queryClient = new QueryClient();

const themeToColorScheme = (s: string) => {
  switch (s) {
    case "light":
    case "dark":
      return s;
  }

  return "light";
};

export default function IndexPopup() {
  const settings = useAtomValue(settingsAtom);

  return (
    <MantineProvider
      theme={{
        cursorType: "pointer",
        colorScheme: themeToColorScheme(settings.theme),
        black: "#343a40",
        primaryColor: "indigo",
        primaryShade: { light: 3, dark: 7 },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
