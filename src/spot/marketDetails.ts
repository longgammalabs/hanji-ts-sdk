import BigNumber from 'bignumber.js';
import { MarketOrderDetails, OrderbookLevel } from '../models';
import { CalculateMarketDetailsSyncParams } from './params';
import { ceil, floor } from 'lodash';

export const defaultBuyMarketDetails: MarketOrderDetails['buy'] = {
  fee: 0,
  estFee: 0,
  worstPrice: 0,
  estPrice: 0,
  estWorstPrice: 0,
  estSlippage: 0,
  autoSlippage: 0,
  tokenXReceive: 0,
  estTokenXReceive: 0,
  tokenYPay: 0,
  estTokenYPay: 0,
};

export const defaultSellMarketDetails: MarketOrderDetails['sell'] = {
  fee: 0,
  estFee: 0,
  worstPrice: 0,
  estPrice: 0,
  estWorstPrice: 0,
  estSlippage: 0,
  autoSlippage: 0,
  tokenXPay: 0,
  estTokenXPay: 0,
  tokenYReceive: 0,
  estTokenYReceive: 0,
};

const AUTO_SLIPPAGE_INCREASE_PERCENT = 10;
const AUTO_SLIPPAGE_DECIMAL = 1;
const AUTO_SLIPPAGE_MAX_PERCENT = 5;

export const getMarketDetails = ({ market, orderbook, inputToken, inputs, direction }: CalculateMarketDetailsSyncParams): MarketOrderDetails => {
  const { tokenXInput, tokenYInput, slippage, useAutoSlippage = false } = inputs;
  const details: MarketOrderDetails = { buy: defaultBuyMarketDetails, sell: defaultSellMarketDetails };

  if (!market.bestAsk || !market.bestBid) {
    return details;
  }

  if (!Number(inputToken === 'base' ? tokenXInput : tokenYInput)) {
    return details;
  }

  const feeRate = market.aggressiveFee + market.passiveOrderPayout;

  if (direction === 'buy') {
    if (inputToken === 'base') {
      details.buy = calculateBuyMarketDetailsTokenXInput(
        Number(tokenXInput),
        slippage,
        market.bestAsk.toNumber(),
        orderbook.asks.sort((a, b) => Number(a.rawPrice - b.rawPrice)),
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        market.priceScalingFactor,
        feeRate,
        useAutoSlippage
      );
    }
    else {
      details.buy = calculateBuyMarketDetailsTokenYInput(
        Number(tokenYInput),
        slippage,
        market.bestAsk.toNumber(),
        orderbook.asks.sort((a, b) => Number(a.rawPrice - b.rawPrice)),
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        market.priceScalingFactor,
        feeRate,
        useAutoSlippage
      );
    }
  }
  else {
    if (inputToken === 'base') {
      details.sell = calculateSellMarketDetailsTokenXInput(
        Number(tokenXInput),
        slippage,
        market.bestBid.toNumber(),
        orderbook.bids.sort((a, b) => Number(b.rawPrice - a.rawPrice)),
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        market.priceScalingFactor,
        feeRate,
        useAutoSlippage
      );
    }
    else {
      details.sell = calculateSellMarketDetailsTokenYInput(
        Number(tokenYInput),
        slippage,
        market.bestBid.toNumber(),
        orderbook.bids.sort((a, b) => Number(b.rawPrice - a.rawPrice)),
        market.tokenXScalingFactor,
        market.tokenYScalingFactor,
        market.priceScalingFactor,
        feeRate,
        useAutoSlippage
      );
    }
  }

  return details;
};

export const calculateBuyMarketDetailsTokenXInput = (
  tokenXInput: number,
  maxSlippage: number,
  bestAsk: number,
  orderbookSide: OrderbookLevel[],
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  priceScalingFactor: number,
  feeRate: number,
  useAutoSlippage: boolean
): MarketOrderDetails['buy'] => {
  let autoSlippage = 0;
  let slippage = maxSlippage;

  const tokenXReceive = new BigNumber(tokenXInput).dp(tokenXScalingFactor, BigNumber.ROUND_FLOOR);

  const { estPrice, estTokenYAmount, estWorstPrice, estSlippage } = calculateEstValuesFromTokenX(
    tokenXReceive.toNumber(),
    orderbookSide,
    bestAsk
  );

  if (useAutoSlippage) {
    autoSlippage = calculateAutoSlippage(estSlippage);
    slippage = autoSlippage;
  }

  const worstPrice = new BigNumber(bestAsk)
    .times(new BigNumber(1).plus(new BigNumber(slippage).div(100)))
    .dp(priceScalingFactor, BigNumber.ROUND_CEIL);
  const tokenYPayWithoutFee = tokenXReceive.times(worstPrice).dp(tokenYScalingFactor, BigNumber.ROUND_CEIL);
  const [tokenYPay, fee] = calculateValueWithFee(
    tokenYPayWithoutFee,
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  const [estTokenYPay, estFee] = calculateValueWithFee(
    new BigNumber(estTokenYAmount),
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  return {
    fee: fee.toNumber(),
    estFee: estFee.toNumber(),
    worstPrice: worstPrice.toNumber(),
    estPrice: ceil(estPrice, priceScalingFactor),
    estWorstPrice: ceil(estWorstPrice, priceScalingFactor),
    estSlippage,
    autoSlippage,

    tokenXReceive: tokenXReceive.toNumber(),
    estTokenXReceive: tokenXReceive.toNumber(),
    tokenYPay: tokenYPay.toNumber(),
    estTokenYPay: estTokenYPay.toNumber(),
  };
};

export const calculateBuyMarketDetailsTokenYInput = (
  tokenYInput: number,
  maxSlippage: number,
  bestAsk: number,
  orderbookSide: OrderbookLevel[],
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  priceScalingFactor: number,
  feeRate: number,
  useAutoSlippage: boolean
): MarketOrderDetails['buy'] => {
  let autoSlippage = 0;
  let slippage = maxSlippage;

  const tokenYPay = new BigNumber(tokenYInput).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);
  const [tokenYWithoutFee, fee] = calculateValueAfterFee(
    tokenYPay,
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  const { estPrice, estSlippage, estTokenXAmount, estWorstPrice } = calculateEstValuesFromTokenY(
    tokenYWithoutFee.toNumber(),
    orderbookSide,
    bestAsk
  );

  if (useAutoSlippage) {
    autoSlippage = calculateAutoSlippage(estSlippage);
    slippage = autoSlippage;
  }

  const worstPrice = new BigNumber(bestAsk)
    .times(new BigNumber(1).plus(new BigNumber(slippage).div(100)))
    .dp(priceScalingFactor, BigNumber.ROUND_CEIL);

  const tokenXReceive = tokenYWithoutFee.div(worstPrice).dp(tokenXScalingFactor, BigNumber.ROUND_FLOOR);

  const estTokenXReceive = new BigNumber(estTokenXAmount).dp(tokenXScalingFactor, BigNumber.ROUND_FLOOR);

  return {
    fee: fee.toNumber(),
    estFee: fee.toNumber(),
    worstPrice: worstPrice.toNumber(),
    estPrice: ceil(estPrice, priceScalingFactor),
    estWorstPrice: ceil(estWorstPrice, priceScalingFactor),
    estSlippage,
    autoSlippage,

    tokenXReceive: tokenXReceive.toNumber(),
    estTokenXReceive: estTokenXReceive.toNumber(),
    tokenYPay: tokenYPay.toNumber(),
    estTokenYPay: tokenYPay.toNumber(),
  };
};

export const calculateSellMarketDetailsTokenXInput = (
  tokenXInput: number,
  maxSlippage: number,
  bestBid: number,
  orderbookSide: OrderbookLevel[],
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  priceScalingFactor: number,
  feeRate: number,
  useAutoSlippage: boolean
): MarketOrderDetails['sell'] => {
  let autoSlippage = 0;
  let slippage = maxSlippage;

  const tokenXPay = new BigNumber(tokenXInput).dp(tokenXScalingFactor, BigNumber.ROUND_FLOOR);

  const { estPrice, estSlippage, estTokenYAmount, estWorstPrice } = calculateEstValuesFromTokenX(
    tokenXPay.toNumber(),
    orderbookSide,
    bestBid
  );

  if (useAutoSlippage) {
    autoSlippage = calculateAutoSlippage(estSlippage);
    slippage = autoSlippage;
  }

  const worstPrice = new BigNumber(bestBid)
    .times(new BigNumber(1).minus(new BigNumber(slippage).div(100)))
    .dp(priceScalingFactor, BigNumber.ROUND_FLOOR);
  const tokenYReceive = tokenXPay.times(worstPrice).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);
  const [tokenYReceiveWithoutFee, fee] = calculateValueAfterFee(
    tokenYReceive,
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  const [estTokenYReceiveWithoutFee, estFee] = calculateValueAfterFee(
    new BigNumber(estTokenYAmount),
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  return {
    fee: fee.toNumber(),
    estFee: estFee.toNumber(),
    worstPrice: worstPrice.toNumber(),
    estPrice: floor(estPrice, priceScalingFactor),
    estWorstPrice: floor(estWorstPrice, priceScalingFactor),
    estSlippage,
    autoSlippage,

    tokenXPay: tokenXPay.toNumber(),
    estTokenXPay: tokenXPay.toNumber(),
    tokenYReceive: tokenYReceiveWithoutFee.toNumber(),
    estTokenYReceive: estTokenYReceiveWithoutFee.toNumber(),
  };
};

export const calculateSellMarketDetailsTokenYInput = (
  tokenYInput: number,
  maxSlippage: number,
  bestBid: number,
  orderbookSide: OrderbookLevel[],
  tokenXScalingFactor: number,
  tokenYScalingFactor: number,
  priceScalingFactor: number,
  feeRate: number,
  useAutoSlippage: boolean
): MarketOrderDetails['sell'] => {
  let autoSlippage = 0;
  let slippage = maxSlippage;

  const tokenYReceive = new BigNumber(tokenYInput).dp(tokenYScalingFactor, BigNumber.ROUND_FLOOR);

  const [tokenYReceiveBeforeFee, fee] = calculateValueBeforeFee(
    tokenYReceive,
    feeRate,
    tokenXScalingFactor + priceScalingFactor,
    tokenYScalingFactor
  );

  const { estPrice, estTokenXAmount, estSlippage, estWorstPrice } = calculateEstValuesFromTokenY(
    tokenYReceiveBeforeFee.toNumber(),
    orderbookSide,
    bestBid
  );

  if (useAutoSlippage) {
    autoSlippage = calculateAutoSlippage(estSlippage);
    slippage = autoSlippage;
  }

  const worstPrice = new BigNumber(bestBid)
    .times(new BigNumber(1).minus(new BigNumber(slippage).div(100)))
    .dp(priceScalingFactor, BigNumber.ROUND_FLOOR);

  const tokenXPay = tokenYReceiveBeforeFee.div(worstPrice).dp(tokenXScalingFactor, BigNumber.ROUND_CEIL);
  const estTokenXPay = new BigNumber(estTokenXAmount).dp(tokenXScalingFactor, BigNumber.ROUND_CEIL);

  return {
    fee: fee.toNumber(),
    estFee: fee.toNumber(),
    worstPrice: worstPrice.toNumber(),
    estPrice: floor(estPrice, priceScalingFactor),
    estWorstPrice: floor(estWorstPrice, priceScalingFactor),
    estSlippage,
    autoSlippage,

    tokenXPay: tokenXPay.toNumber(),
    estTokenXPay: estTokenXPay.toNumber(),
    tokenYReceive: tokenYReceive.toNumber(),
    estTokenYReceive: tokenYReceive.toNumber(),
  };
};

export const calculateEstValuesFromTokenX = (tokenX: number, orderbookSide: OrderbookLevel[], initialPrice: number) => {
  let totalCost = new BigNumber(0);
  let tokenXLeft = new BigNumber(tokenX);
  let estWorstPrice = new BigNumber(0);

  for (const level of orderbookSide) {
    const price = new BigNumber(level.price);
    const size = new BigNumber(level.size);
    const tradeQuantity = BigNumber.min(tokenXLeft, size);
    totalCost = totalCost.plus(tradeQuantity.times(price));
    tokenXLeft = tokenXLeft.minus(tradeQuantity);
    estWorstPrice = price;

    if (tokenXLeft.lte(0)) break;
  }

  const estPrice = totalCost.div(new BigNumber(tokenX).minus(tokenXLeft));
  const estSlippage = estWorstPrice.minus(initialPrice).div(initialPrice).abs().times(100);
  const estTokenYAmount = totalCost;

  return {
    estPrice: estPrice.toNumber(),
    estSlippage: estSlippage.toNumber(),
    estTokenYAmount: estTokenYAmount.toNumber(),
    estWorstPrice: estWorstPrice.toNumber(),
  };
};

export const calculateEstValuesFromTokenY = (tokenY: number, orderbookSide: OrderbookLevel[], initialPrice: number) => {
  let totalQuantity = new BigNumber(0);
  let tokenYLeft = new BigNumber(tokenY);
  let estWorstPrice = new BigNumber(0);

  for (const level of orderbookSide) {
    const price = new BigNumber(level.price);
    const size = new BigNumber(level.size);
    const tradeCost = BigNumber.min(tokenYLeft, size.times(price));
    totalQuantity = totalQuantity.plus(tradeCost.div(price));
    tokenYLeft = tokenYLeft.minus(tradeCost);
    estWorstPrice = price;

    if (tokenYLeft.lte(0)) break;
  }

  const estPrice = new BigNumber(tokenY).minus(tokenYLeft).div(totalQuantity);
  const estSlippage = estWorstPrice.minus(initialPrice).div(initialPrice).abs().times(100);
  const estTokenXAmount = totalQuantity;

  return {
    estPrice: estPrice.toNumber(),
    estSlippage: estSlippage.toNumber(),
    estTokenXAmount: estTokenXAmount.toNumber(),
    estWorstPrice: estWorstPrice.toNumber(),
  };
};

export const calculateValueWithFee = (
  value: BigNumber,
  feeRate: number,
  feeDecimalPlaces: number,
  valueDecimalPlaces: number
): [BigNumber, BigNumber] => {
  const fee = value.times(feeRate).dp(feeDecimalPlaces, BigNumber.ROUND_CEIL);
  const valueWithFee = value.plus(fee).dp(valueDecimalPlaces, BigNumber.ROUND_CEIL);
  return [valueWithFee, fee];
};

export const calculateValueAfterFee = (
  value: BigNumber,
  feeRate: number,
  feeDecimalPlaces: number,
  valueDecimalPlaces: number
): [BigNumber, BigNumber] => {
  const fee = value.times(feeRate).dp(feeDecimalPlaces, BigNumber.ROUND_CEIL);
  const valueAfterFee = value.minus(fee).dp(valueDecimalPlaces, BigNumber.ROUND_FLOOR);
  return [valueAfterFee, fee];
};

export const calculateValueBeforeFee = (
  value: BigNumber,
  feeRate: number,
  feeDecimalPlaces: number,
  valueDecimalPlaces: number
): [BigNumber, BigNumber] => {
  const valueBeforeFee = value.div(new BigNumber(1).minus(feeRate)).dp(valueDecimalPlaces, BigNumber.ROUND_CEIL);
  const fee = valueBeforeFee.minus(value).dp(feeDecimalPlaces, BigNumber.ROUND_CEIL);
  return [valueBeforeFee, fee];
};

const calculateAutoSlippage = (estSlippage: number) => {
  const diff = new BigNumber(estSlippage).times(new BigNumber(AUTO_SLIPPAGE_INCREASE_PERCENT).div(100));
  const autoSlippage = new BigNumber(estSlippage).plus(diff).dp(AUTO_SLIPPAGE_DECIMAL, BigNumber.ROUND_CEIL);
  if (autoSlippage.isZero()) {
    return 0.1;
  }

  return autoSlippage.gt(AUTO_SLIPPAGE_MAX_PERCENT) ? AUTO_SLIPPAGE_MAX_PERCENT : autoSlippage.toNumber();
};
