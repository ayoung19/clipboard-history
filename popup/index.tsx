import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import { App } from "./App";
import { useThemeColorScheme } from "./hooks/useThemeColorScheme";

import "./index.css";

import { AllTagsProvider } from "./contexts/AllTagsContext";
import { EntriesProvider } from "./contexts/EntriesContext";
import { EntryIdToTagsProvider } from "./contexts/EntryIdToTagsContext";
import { FavoriteEntryIdsProvider } from "./contexts/FavoriteEntryIdsContext";

export default function IndexPopup() {
  const themeColorScheme = useThemeColorScheme();

  return (
    <MantineProvider
      theme={{
        colorScheme: themeColorScheme,
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
      <EntriesProvider>
        <FavoriteEntryIdsProvider>
          <EntryIdToTagsProvider>
            <AllTagsProvider>
              <ModalsProvider>
                <Notifications />
                <App />
              </ModalsProvider>
            </AllTagsProvider>
          </EntryIdToTagsProvider>
        </FavoriteEntryIdsProvider>
      </EntriesProvider>
    </MantineProvider>
  );
}
