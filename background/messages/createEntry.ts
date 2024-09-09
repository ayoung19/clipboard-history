import type { PlasmoMessaging } from "@plasmohq/messaging";

import { setClipboardContent } from "~storage/clipboardContent";
import { getClipboardMonitorIsEnabled } from "~storage/clipboardMonitor";
import { createEntry } from "~utils/storage";

export interface CreateEntryRequestBody {
  content: string;
}

const handler: PlasmoMessaging.MessageHandler<CreateEntryRequestBody> = async (req, res) => {
  if (req.body && (await getClipboardMonitorIsEnabled())) {
    await Promise.all([setClipboardContent(req.body.content), createEntry(req.body.content)]);
  }
};

export default handler;
