import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";
import { getClipboardSnapshot, updateClipboardSnapshot } from "~storage/clipboardSnapshot";
import { getSettings } from "~storage/settings";
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
    const [clipboardSnapshot, settings] = await Promise.all([
      getClipboardSnapshot(),
      getSettings(),
    ]);

    if (clipboardSnapshot === undefined || req.body.timestamp > clipboardSnapshot.updatedAt) {
      if (req.body.content !== clipboardSnapshot?.content) {
        await Promise.all([
          updateClipboardSnapshot(req.body.content),
          // If we allow blank items then an entry is always created regardless
          // of what the content is. If we don't, then only create an entry if the
          // content isn't blank.
          (settings.allowBlankItems || req.body.content.length > 0) &&
            createEntry(req.body.content),
        ]);
      }
    }
  }

  res.send({});
};

export default handler;
