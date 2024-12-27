import { sendToBackground } from "@plasmohq/messaging";

import type {
  CreateEntryRequestBody,
  CreateEntryResponseBody,
} from "~background/messages/createEntry";
import type {
  GetClipboardMonitorIsEnabledRequestBody,
  GetClipboardMonitorIsEnabledResponseBody,
} from "~background/messages/getClipboardMonitorIsEnabled";
import { watchClipboard } from "~utils/background";

watchClipboard(
  window,
  document,
  () =>
    sendToBackground<
      GetClipboardMonitorIsEnabledRequestBody,
      GetClipboardMonitorIsEnabledResponseBody
    >({
      name: "getClipboardMonitorIsEnabled",
    }),
  async (content) => {
    await sendToBackground<CreateEntryRequestBody, CreateEntryResponseBody>({
      name: "createEntry",
      body: {
        content,
        // Race condition with popup. Adding this delay in the recorded timestamp allows the
        // clipboard monitor to fail to create an entry when racing with the popup. It will succeed
        // on the next interval as long as the popup doesn't write to clipboardSnapshot again.
        timestamp: Date.now() - 1000,
      },
    });
  },
);
