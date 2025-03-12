import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import { App } from "./App";

import "./index.css";

import { AllTagsProvider } from "./contexts/AllTagsContext";
import { EntriesProvider } from "./contexts/EntriesContext";
import { EntryIdToTagsProvider } from "./contexts/EntryIdToTagsContext";
import { FavoriteEntryIdsProvider } from "./contexts/FavoriteEntryIdsContext";
import { useTheme } from "./hooks/useTheme";

export default function IndexPopup() {
  const theme = useTheme();

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
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
