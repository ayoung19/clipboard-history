import { createHash } from "crypto";
import { lookup } from "@instantdb/core";
import { match } from "ts-pattern";

import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getClipboardSnapshot, updateClipboardSnapshot } from "~storage/clipboardSnapshot";
import { getSettings } from "~storage/settings";
import { StorageLocation } from "~types/storageLocation";
import db from "~utils/db/core";
import { createEntry } from "~utils/storage";

import { handleUpdateContextMenusRequest } from "./updateContextMenus";

export interface CreateEntryRequestBody {
  content: string;
  timestamp: number;
}

// https://www.totaltypescript.com/the-empty-object-type-in-typescript#representing-an-empty-object
export type CreateEntryResponseBody = Record<PropertyKey, never>;

export const handleCreateEntryRequest = async (body: CreateEntryRequestBody) => {
  const [clipboardSnapshot, settings] = await Promise.all([getClipboardSnapshot(), getSettings()]);

  if (clipboardSnapshot === undefined || body.timestamp > clipboardSnapshot.updatedAt) {
    if (body.content !== clipboardSnapshot?.content) {
      await Promise.all([
        updateClipboardSnapshot(body.content),
        // If we allow blank items then an entry is always created regardless of what the content
        // is. If we don't, then only create an entry if the content isn't blank.
        (settings.allowBlankItems || body.content.length > 0) &&
          (settings.localItemCharacterLimit === null ||
            body.content.length <= settings.localItemCharacterLimit) &&
          match(settings.storageLocation)
            .with(StorageLocation.Enum.Local, () => createEntry(body.content))
            .with(StorageLocation.Enum.Cloud, async () => {
              const user = await db.getAuth();

              const contentHash = createHash("sha256").update(body.content).digest("hex");

              await db.transact(
                db.tx.entries[lookup("emailContentHash", `${user.email}+${contentHash}`)]!.update({
                  content: body.content,
                  createdAt: Date.now(),
                }).link({ $user: lookup("email", user.email) }),
              );
            })
            .exhaustive(),
      ]);

      await handleUpdateContextMenusRequest();
    }
  }
};

const handler: PlasmoMessaging.MessageHandler<
  CreateEntryRequestBody,
  CreateEntryResponseBody
> = async (req, res) => {
  if (req.body) {
    await handleCreateEntryRequest(req.body);
  }

  res.send({});
};

export default handler;
