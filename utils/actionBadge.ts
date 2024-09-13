export const setActionBadge = async (n: number) =>
  await chrome.action.setBadgeText({
    text: Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
      roundingMode: "floor",
    }).format(n),
  });
