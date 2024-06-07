import BigNumber from 'bignumber.js';
import { formatUnits, parseUnits } from 'ethers';

export const convertTokensRawAmountToAmount = (amount: string | bigint, decimals: number): BigNumber => {
  return new BigNumber(formatUnits(amount, decimals));
};

export const convertTokensAmountToRawAmount = (amount: BigNumber, decimals: number): bigint => {
  const preparedAmount = amount.toFixed(decimals, BigNumber.ROUND_DOWN);

  return parseUnits(preparedAmount, decimals);
};
