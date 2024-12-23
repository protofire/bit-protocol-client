import BigNumber from "bignumber.js";

export const fromBigNumber = (num, decimals = 1e18) =>
  Number(new BigNumber(num).div(decimals).toFixed());

export const formatNumber = (num) => {
  if (isNaN(num)) return 0;
  return num.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
};

export const checkProtectedRoute = (path, routes) => {
  if (routes.includes(path)) return true;
  if (path.startsWith("/Mint/")) return true;
  return false;
};
