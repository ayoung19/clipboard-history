import type { PlasmoMessaging } from "@plasmohq/messaging";

import { createEntry } from "~utils/storage";

export interface CreateEntryRequestBody {
  content: string;
}

const handler: PlasmoMessaging.MessageHandler<CreateEntryRequestBody> = async (req, res) => {
  if (req.body) {
    await createEntry(req.body.content);
  }

  res.send({});
};

export default handler;
