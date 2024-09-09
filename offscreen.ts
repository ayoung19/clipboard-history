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
    },
  });
}, 1000);
