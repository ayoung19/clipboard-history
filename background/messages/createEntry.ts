import type { PlasmoMessaging } from "@plasmohq/messaging";

import { setClipboardContent } from "~storage/clipboardContent";
import { createEntry } from "~utils/storage";

export interface CreateEntryRequestBody {
  content: string;
}

const handler: PlasmoMessaging.MessageHandler<CreateEntryRequestBody> = async (req, res) => {
  if (req.body) {
    await Promise.all([setClipboardContent(req.body.content), createEntry(req.body.content)]);
  }
};

export default handler;
