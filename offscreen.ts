import { sendToBackground } from "@plasmohq/messaging";

import type {
  CreateEntryRequestBody,
  CreateEntryResponseBody,
} from "~background/messages/createEntry";

const textarea = document.createElement("textarea");
document.body.appendChild(textarea);

const read = () => {
  textarea.value = "";
  textarea.focus();
  document.execCommand("paste");
  return textarea.value;
};

setInterval(() => {
  sendToBackground<CreateEntryRequestBody, CreateEntryResponseBody>({
    name: "createEntry",
    body: {
      content: read(),
      // Race condition with startup. Adding this delay in the recorded
      // timestamp allows the clipboard monitor to fail to create an entry when
      // racing with the popup. It will succeed on the next interval as long as
      // the popup doesn't write to clipboardSnapshot again.
      timestamp: Date.now() - 1000,
    },
  });
}, 1000);
