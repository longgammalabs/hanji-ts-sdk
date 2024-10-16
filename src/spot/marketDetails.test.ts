import { expect } from '@jest/globals';
import { testMarket, testOrderbook } from '../helpers.test';
import { CalculateMarketDetailsSyncParams } from './params';
import { defaultBuyMarketDetails, defaultSellMarketDetails, getMarketDetails } from './marketDetails';

describe('Calculate market details without inputs', () => {
  test.each([
    { market: testMarket, direction: 'buy', inputToken: 'base', orderbook: testOrderbook, inputs: { tokenXInput: '', tokenYInput: '', slippage: 0.1, useAutoSlippage: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', orderbook: testOrderbook, inputs: { tokenXInput: '', tokenYInput: '', slippage: 0.1, useAutoSlippage: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', orderbook: testOrderbook, inputs: { tokenXInput: '', tokenYInput: '1', slippage: 0.1, useAutoSlippage: false } },
    { market: testMarket, direction: 'sell', inputToken: 'quote', orderbook: testOrderbook, inputs: { tokenXInput: '1', tokenYInput: '', slippage: 0.1, useAutoSlippage: false } },
  ] as CalculateMarketDetailsSyncParams[])('inputToken: $inputToken, tokenX: $inputs.tokenXInput, tokenY: $inputs.tokenYInput', params => {
    const result = getMarketDetails(params);
    expect(result).toEqual({ buy: defaultBuyMarketDetails, sell: defaultSellMarketDetails });
  });
});

describe('Calculate buy market details with base token input', () => {
  test('Execute on first level', () => {
    const result = getMarketDetails({ market: testMarket,
      direction: 'buy',
      inputToken: 'base',
      orderbook: testOrderbook,
      inputs: { tokenXInput: '10', tokenYInput: '', slippage: 0.1, useAutoSlippage: false },
    });
    expect(result.sell).toEqual(defaultSellMarketDetails);
    expect(result.buy).toEqual({
      fee: 0.00244405,
      estFee: 0.0024416,
      worstPrice: 0.6983,
      estPrice: 0.6976,
      estWorstPrice: 0.6976,
      estSlippage: 0,
      autoSlippage: 0,
      tokenXReceive: 10,
      estTokenXReceive: 10,
      tokenYPay: 6.98544405,
      estTokenYPay: 6.9784416,
    });
  });

  // TODO: execute few levels
  // TODO: execute all orderbook
  // TODO: partial execution
  // TODO: execution with auto slippage
});

describe('Calculate buy market details with quote token input', () => {
  test('Execute on first level', () => {
    const result = getMarketDetails({ market: testMarket,
      direction: 'buy',
      inputToken: 'quote',
      orderbook: testOrderbook,
      inputs: { tokenXInput: '', tokenYInput: '10', slippage: 0.1, useAutoSlippage: false },
    });
    expect(result.sell).toEqual(defaultSellMarketDetails);
    expect(result.buy).toEqual({
      fee: 0.0035,
      estFee: 0.0035,
      worstPrice: 0.6983,
      estPrice: 0.6976,
      estWorstPrice: 0.6976,
      estSlippage: 0,
      autoSlippage: 0,
      tokenXReceive: 14.31548,
      estTokenXReceive: 14.32984,
      tokenYPay: 10,
      estTokenYPay: 10,
    });
  });

  // TODO: execute few levels
  // TODO: execute all orderbook
  // TODO: partial execution
  // TODO: execution with auto slippage
});

describe('Calculate sell market details with base token input', () => {
  test('Execute on first level', () => {
    const result = getMarketDetails({
      market: testMarket,
      direction: 'sell',
      inputToken: 'base',
      orderbook: testOrderbook,
      inputs: { tokenXInput: '10', tokenYInput: '', slippage: 0.1, useAutoSlippage: false },
    });
    expect(result.buy).toEqual(defaultBuyMarketDetails);
    expect(result.sell).toEqual({
      fee: 0.00243285,
      estFee: 0.0024353,
      worstPrice: 0.6951,
      estPrice: 0.6958,
      estWorstPrice: 0.6958,
      estSlippage: 0,
      autoSlippage: 0,
      tokenXPay: 10,
      estTokenXPay: 10,
      tokenYReceive: 6.94856715,
      estTokenYReceive: 6.9555647,
    });
  });

  // TODO: execute few levels
  // TODO: execute all orderbook
  // TODO: partial execution
  // TODO: execution with auto slippage
});

describe('Calculate buy market details with quote token input', () => {
  test('Execute on first level', () => {
    const result = getMarketDetails({
      market: testMarket,
      direction: 'sell',
      inputToken: 'quote',
      orderbook: testOrderbook,
      inputs: { tokenXInput: '', tokenYInput: '10', slippage: 0.1, useAutoSlippage: false },
    });
    expect(result.buy).toEqual(defaultBuyMarketDetails);
    expect(result.sell).toEqual({
      fee: 0.003501226,
      estFee: 0.003501226,
      worstPrice: 0.6951,
      estPrice: 0.6958,
      estWorstPrice: 0.6958,
      estSlippage: 0,
      autoSlippage: 0,
      tokenXPay: 14.39146,
      estTokenXPay: 14.37698,
      tokenYReceive: 10,
      estTokenYReceive: 10,
    });
  });

  // TODO: execute few levels
  // TODO: execute all orderbook
  // TODO: partial execution
  // TODO: execution with auto slippage
});
