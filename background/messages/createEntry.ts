import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { getClipboardSnapshot, updateClipboardSnapshot } from "~storage/clipboardSnapshot";
import { createEntry } from "~utils/storage";

export interface CreateEntryRequestBody {
  content: string;
  timestamp: number;
}

export interface CreateEntryResponseBody {}

const handler: PlasmoMessaging.MessageHandler<
  CreateEntryRequestBody,
  CreateEntryResponseBody
> = async (req, res) => {
  if (req.body && (await getClipboardMonitorIsEnabled())) {
    const clipboardSnapshot = await getClipboardSnapshot();

    if (clipboardSnapshot === undefined || req.body.timestamp > clipboardSnapshot.updatedAt) {
      if (req.body.content !== clipboardSnapshot?.content) {
        await Promise.all([
          updateClipboardSnapshot(req.body.content),
          createEntry(req.body.content),
        ]);
      }
    }
  }

  res.send({});
};

export default handler;
