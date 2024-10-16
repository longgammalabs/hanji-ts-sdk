import BigNumber from 'bignumber.js';
import { LimitOrderDetails } from '../models';
import { CalculateLimitDetailsSyncParams } from './params';
import { max } from 'lodash';

export const defaultBuyLimitDetails: LimitOrderDetails['buy'] = {
  maxFee: 0,
  price: 0,
  tokenXReceive: 0,
  maxTokenYPay: 0,
  minTokenYPay: 0,
};

export const defaultSellLimitDetails: LimitOrderDetails['sell'] = {
  maxFee: 0,
  price: 0,
  tokenXPay: 0,
  maxTokenYReceive: 0,
  minTokenYReceive: 0,
};

export const getLimitDetails = ({ market, direction, inputToken, inputs }: CalculateLimitDetailsSyncParams): LimitOrderDetails => {
  const { tokenXInput, tokenYInput, priceInput } = inputs;
  const details: LimitOrderDetails = { buy: defaultBuyLimitDetails, sell: defaultSellLimitDetails };

  if (!Number(priceInput) || !Number(inputToken === 'base' ? tokenXInput : tokenYInput)) {
    return details;
  }

  const maxFeeRate
    = max([
      market.aggressiveFee + market.passiveOrderPayout,
      market.passiveFee,
    ]) || 0;

  if (direction === 'buy') {
    if (inputToken === 'base') {
      details.buy = calculateBuyLimitDetailsTokenXInput(
        Number(priceInput),
        Number(tokenXInput),
        market.priceScalingFactor,
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        maxFeeRate
      );
    }
    else {
      details.buy = calculateBuyLimitDetailsTokenYInput(
        Number(priceInput),
        Number(tokenYInput),
        market.priceScalingFactor,
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        maxFeeRate
      );
    }
  }
  else {
    if (inputToken === 'base') {
      details.sell = calculateSellLimitDetailsTokenXInput(
        Number(priceInput),
        Number(tokenXInput),
        market.priceScalingFactor,
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        maxFeeRate
      );
    }
    else {
      details.sell = calculateSellLimitDetailsTokenYInput(
        Number(priceInput),
        Number(tokenYInput),
        market.priceScalingFactor,
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        maxFeeRate
      );
    }
  }

  return details;
};

export const calculateBuyLimitDetailsTokenXInput = (
  priceInput: number,
  tokenXInput: number,
  priceScalingFactor: number,
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  maxFeeRate: number
): LimitOrderDetails['buy'] => {
  const price = new BigNumber(priceInput).dp(priceScalingFactor, BigNumber.ROUND_DOWN);
  const tokenXReceive = new BigNumber(tokenXInput).dp(tokenXScalingFactor, BigNumber.ROUND_DOWN);
  const minTokenYPay = price.times(tokenXReceive).dp(tokenYScalingFactor, BigNumber.ROUND_CEIL);
  const maxFee = minTokenYPay.times(maxFeeRate).dp(tokenXScalingFactor + priceScalingFactor, BigNumber.ROUND_CEIL);
  const maxTokenYPay = minTokenYPay.plus(maxFee).dp(tokenYScalingFactor, BigNumber.ROUND_CEIL);

  return {
    price: price.toNumber(),
    maxFee: maxFee.toNumber(),
    tokenXReceive: tokenXReceive.toNumber(),
    maxTokenYPay: maxTokenYPay.toNumber(),
    minTokenYPay: minTokenYPay.toNumber(),
  };
};

export const calculateBuyLimitDetailsTokenYInput = (
  priceInput: number,
  tokenYInput: number,
  priceScalingFactor: number,
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  maxFeeRate: number
): LimitOrderDetails['buy'] => {
  const price = new BigNumber(priceInput).dp(priceScalingFactor, BigNumber.ROUND_DOWN);
  const maxTokenYPay = new BigNumber(tokenYInput).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);
  const minTokenYPay = maxTokenYPay
    .div(new BigNumber(1).plus(maxFeeRate))
    .dp(tokenYScalingFactor, BigNumber.ROUND_CEIL);
  const tokenXReceive = minTokenYPay.div(price).dp(tokenXScalingFactor, BigNumber.ROUND_DOWN);
  const maxFee = minTokenYPay.times(maxFeeRate).dp(tokenXScalingFactor + priceScalingFactor, BigNumber.ROUND_CEIL);

  return {
    price: price.toNumber(),
    maxFee: maxFee.toNumber(),
    tokenXReceive: tokenXReceive.toNumber(),
    maxTokenYPay: maxTokenYPay.toNumber(),
    minTokenYPay: minTokenYPay.toNumber(),
  };
};

export const calculateSellLimitDetailsTokenXInput = (
  priceInput: number,
  tokenXInput: number,
  priceScalingFactor: number,
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  maxFeeRate: number
): LimitOrderDetails['sell'] => {
  const price = new BigNumber(priceInput).dp(priceScalingFactor, BigNumber.ROUND_DOWN);
  const tokenXPay = new BigNumber(tokenXInput).dp(tokenXScalingFactor, BigNumber.ROUND_DOWN);
  const maxTokenYReceive = price.times(tokenXPay).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);
  const maxFee = maxTokenYReceive.times(maxFeeRate).dp(tokenXScalingFactor + priceScalingFactor, BigNumber.ROUND_CEIL);
  const minTokenYReceive = maxTokenYReceive.minus(maxFee).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);

  return {
    price: price.toNumber(),
    maxFee: maxFee.toNumber(),
    tokenXPay: tokenXPay.toNumber(),
    maxTokenYReceive: maxTokenYReceive.toNumber(),
    minTokenYReceive: minTokenYReceive.toNumber(),
  };
};

export const calculateSellLimitDetailsTokenYInput = (
  priceInput: number,
  tokenYInput: number,
  priceScalingFactor: number,
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  maxFeeRate: number
): LimitOrderDetails['sell'] => {
  const price = new BigNumber(priceInput).dp(priceScalingFactor, BigNumber.ROUND_DOWN);
  const minTokenYReceive = new BigNumber(tokenYInput).dp(tokenYScalingFactor, BigNumber.ROUND_DOWN);
  const maxTokenYReceive = minTokenYReceive
    .div(new BigNumber(1).minus(maxFeeRate))
    .dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);
  const tokenXPay = maxTokenYReceive.div(price).dp(tokenXScalingFactor, BigNumber.ROUND_UP);
  const maxFee = maxTokenYReceive.times(maxFeeRate).dp(tokenXScalingFactor + priceScalingFactor, BigNumber.ROUND_CEIL);

  return {
    price: price.toNumber(),
    maxFee: maxFee.toNumber(),
    tokenXPay: tokenXPay.toNumber(),
    maxTokenYReceive: maxTokenYReceive.toNumber(),
    minTokenYReceive: minTokenYReceive.toNumber(),
  };
};
