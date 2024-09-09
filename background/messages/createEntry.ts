import type { PlasmoMessaging } from "@plasmohq/messaging";

import { setClipboardContent } from "~storage/clipboardContent";
import { getClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { createEntry } from "~utils/storage";

export interface CreateEntryRequestBody {
  content: string;
}

export interface CreateEntryResponseBody {}

const handler: PlasmoMessaging.MessageHandler<
  CreateEntryRequestBody,
  CreateEntryResponseBody
> = async (req, res) => {
  if (req.body && (await getClipboardMonitorIsEnabled())) {
    await Promise.all([setClipboardContent(req.body.content), createEntry(req.body.content)]);
  }

  res.send({});
};

export default handler;
