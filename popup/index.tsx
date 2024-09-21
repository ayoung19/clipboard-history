import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { useThemeColorScheme } from "./hooks/useThemeColorScheme";

const queryClient = new QueryClient();

export default function IndexPopup() {
  const colorScheme = useThemeColorScheme();

  return (
    <MantineProvider
      theme={{
        colorScheme,
        cursorType: "pointer",
        black: "#343a40", // gray.8
        primaryColor: "indigo",
        primaryShade: { light: 3, dark: 7 },
        colors: {
          // Change dark.0 to gray.3, keep the rest.
          dark: [
            "#dee2e6",
            "#A6A7AB",
            "#909296",
            "#5c5f66",
            "#373A40",
            "#2C2E33",
            "#25262b",
            "#1A1B1E",
            "#141517",
            "#101113",
          ],
        },
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
