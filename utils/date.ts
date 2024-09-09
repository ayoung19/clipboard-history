import { differenceInSeconds, format } from "date-fns";
import { timeAgo } from "short-time-ago";

export const badgeDateFormatter = (now: Date, d: Date) => {
  const seconds = differenceInSeconds(now, d);

  if (seconds > 86400) {
    return format(d, "PP");
  }

  return timeAgo(d, now).replace(" ago", "");
};
