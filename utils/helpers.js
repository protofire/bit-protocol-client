import BigNumber from 'bignumber.js';

export const fromBigNumber = (num, decimals = 1e18) =>
  Number(new BigNumber(num).div(decimals).toFixed());

export const convertInterestRate = (interestRate) => {
  // Create a BigNumber from the contract value
  const bnInterestRate = new BigNumber(interestRate);

  // Divide by INTEREST_PRECISION (1e27)
  const withoutPrecision = bnInterestRate.div(1e27);

  // Multiply by 10000 * SECONDS_IN_YEAR to get the annual rate
  // SECONDS_IN_YEAR = 31536000 (365 days)
  const annualRate = withoutPrecision.times(10000).times(31536000);

  // Convert to percentage format with 2 decimal places
  return (annualRate / 100).toFixed(2);
};

export const formatNumber = (num) => {
  if (isNaN(num)) return 0;
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short',
  });
};

export const checkProtectedRoute = (path, routes) => {
  if (routes.includes(path)) return true;
  if (path.startsWith('/Mint/')) return true;
  return false;
};

export const bnIsBiggerThan = (big = new BigNumber(0), num = 0) => {
  const numBN = new BigNumber(num).multipliedBy(1e18).integerValue().toFixed();
  return big.lt(numBN);
};

export const inputValueDisplay = (value, balance, isPayable) => {
  if (value === 0) return '0';
  if (!isPayable && bnIsBiggerThan(balance, value))
    return balance.div(1e18).toString();
  return value || '';
};
