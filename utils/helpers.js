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


export const bnIsBiggerThan = (big = new BigNumber(0), num = 0) => {
  const numBN = new BigNumber(num).multipliedBy(1e18).integerValue().toFixed();
  return big.lt(numBN);
}

export const inputValueDisplay = (value, balance, isPayable) => {
  if (value === 0) return "0"
  if (!isPayable && bnIsBiggerThan(balance, value)) return balance.div(1e18).toString()
  return value || ""
}