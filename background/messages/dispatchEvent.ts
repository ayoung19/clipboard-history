import type { PlasmoMessaging } from "@plasmohq/messaging";

export interface DispatchEventRequestBody {
  eventType: string;
}

// https://www.totaltypescript.com/the-empty-object-type-in-typescript#representing-an-empty-object
export type DispatchEventResponseBody = Record<PropertyKey, never>;

const handler: PlasmoMessaging.MessageHandler<
  DispatchEventRequestBody,
  DispatchEventResponseBody
> = async (req, res) => {
  if (req.body) {
    dispatchEvent(new Event(req.body.eventType));
  }

  res.send({});
};

export default handler;
