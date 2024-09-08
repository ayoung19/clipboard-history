import { sendToBackground } from "@plasmohq/messaging";

import type { CreateEntryRequestBody } from "~background/messages/createEntry";

const textarea = document.createElement("textarea");
document.body.appendChild(textarea);

const read = () => {
  textarea.value = "";
  textarea.focus();
  document.execCommand("paste");
  return textarea.value;
};

const write = (value: string) => {
  textarea.value = value;
  textarea.select();
  document.execCommand("copy");
};

setInterval(() => {
  sendToBackground<CreateEntryRequestBody>({
    name: "createEntry",
    body: {
      content: read(),
    },
  });
}, 1000);
