import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getClipboardMonitorIsEnabled } from "~storage/clipboardMonitorIsEnabled";

export type GetClipboardMonitorIsEnabledRequestBody = undefined;

export type GetClipboardMonitorIsEnabledResponseBody = boolean;

const handler: PlasmoMessaging.MessageHandler<
  GetClipboardMonitorIsEnabledRequestBody,
  GetClipboardMonitorIsEnabledResponseBody
> = async (_, res) => {
  res.send(await getClipboardMonitorIsEnabled());
};

export default handler;
