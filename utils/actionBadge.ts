import iconOff128Src from "data-base64:~assets/iconOff128.png";
import iconOn128Src from "data-base64:~assets/iconOn128.png";

export const setActionBadgeText = (totalEntries: number) =>
  chrome.action.setBadgeText({
    text: Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
      roundingMode: "floor",
    }).format(totalEntries),
  });

export const setActionIconAndBadgeBackgroundColor = (on: boolean) =>
  Promise.all([
    chrome.action.setIcon({ path: { "32": on ? iconOn128Src : iconOff128Src } }),
    chrome.action.setBadgeBackgroundColor({ color: on ? "#4263eb" : "#495057" }),
  ]);
