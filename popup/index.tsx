import { MantineProvider } from "@mantine/core";

import { App } from "./App";

export default function IndexPopup() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
}
