import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getRefreshToken } from "~storage/refreshToken";

export type GetRefreshTokenRequestBody = undefined;

export type GetRefreshTokenResponseBody = string | null;

const handler: PlasmoMessaging.MessageHandler<
  GetRefreshTokenRequestBody,
  GetRefreshTokenResponseBody
> = async (_, res) => {
  res.send(await getRefreshToken());
};

export default handler;
