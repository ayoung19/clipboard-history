import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { App } from "./App";
import { settingsAtom } from "./states/atoms";

const queryClient = new QueryClient();

export default function IndexPopup() {
  const settings = useAtomValue(settingsAtom);

  return (
    <MantineProvider theme={{ cursorType: "pointer" }} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
