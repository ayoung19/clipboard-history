import iconOff128Src from "data-base64:~assets/iconOff128.png";
import iconOn128Src from "data-base64:~assets/iconOn128.png";

const action = process.env.PLASMO_TARGET === "firefox-mv2" ? chrome.browserAction : chrome.action;

export const setActionBadgeText = async (totalEntries: number) => {
  await action.setBadgeText({
    text: Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
      roundingMode: "floor",
    }).format(totalEntries),
  });
};

export const removeActionBadgeText = async () => {
  await action.setBadgeText({ text: "" });
};

export const setActionIconAndBadgeBackgroundColor = async (on: boolean) => {
  await Promise.all([
    action.setIcon({ path: { "32": on ? iconOn128Src : iconOff128Src } }),
    action.setBadgeBackgroundColor({ color: on ? "#4263eb" : "#495057" }),
  ]);
};
