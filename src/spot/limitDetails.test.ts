import { expect } from '@jest/globals';
import { defaultBuyLimitDetails, defaultSellLimitDetails, getLimitDetails } from './limitDetails';
import { testMarket } from '../helpers.test';
import { CalculateLimitDetailsSyncParams } from './params';

describe('Calculate limit details without inputs', () => {
  test.each([
    { market: testMarket, direction: 'buy', inputToken: 'base', inputs: { priceInput: '', tokenXInput: '', tokenYInput: '', postOnly: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', inputs: { priceInput: '', tokenXInput: '', tokenYInput: '', postOnly: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', inputs: { priceInput: '0.9', tokenXInput: '', tokenYInput: '', postOnly: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', inputs: { priceInput: '', tokenXInput: '1', tokenYInput: '', postOnly: false } },
    { market: testMarket, direction: 'sell', inputToken: 'base', inputs: { priceInput: '0.9', tokenXInput: '', tokenYInput: '1', postOnly: false } },
  ] as CalculateLimitDetailsSyncParams[])('inputToken: $inputToken, priceInput: $inputs.priceInput, tokenX: $inputs.tokenXInput, tokenY: $inputs.tokenYInput', params => {
    const result = getLimitDetails(params);
    expect(result).toEqual({ buy: defaultBuyLimitDetails, sell: defaultSellLimitDetails });
  });
});

describe('Calculate buy limit details with base token input', () => {
  test('Low precision inputs', () => {
    const result = getLimitDetails({ market: testMarket, direction: 'buy', inputToken: 'base', inputs: { priceInput: '0.9', tokenXInput: '10', tokenYInput: '', postOnly: false } });
    expect(result.sell).toEqual(defaultSellLimitDetails);
    expect(result.buy).toEqual({ maxFee: 0.00315, price: 0.9, tokenXReceive: 10, maxTokenYPay: 9.00315, minTokenYPay: 9 });
  });

  test('High precision inputs', () => {
    const result = getLimitDetails({ market: testMarket, direction: 'buy', inputToken: 'base', inputs: { priceInput: '0.123456789', tokenXInput: '10.123456789', tokenYInput: '', postOnly: false } });
    expect(result.sell).toEqual(defaultSellLimitDetails);
    expect(result.buy).toEqual({ maxFee: 0.000437232, price: 0.1234, tokenXReceive: 10.12345, maxTokenYPay: 1.249670962, minTokenYPay: 1.24923373 });
  });
});

describe('Calculate buy limit details with quote token input', () => {
  test('Low precision inputs', () => {
    const result = getLimitDetails({ market: testMarket, direction: 'buy', inputToken: 'quote', inputs: { priceInput: '0.9', tokenXInput: '', tokenYInput: '10', postOnly: false } });
    expect(result.sell).toEqual(defaultSellLimitDetails);
    expect(result.buy).toEqual({ maxFee: 0.003498776, price: 0.9, tokenXReceive: 11.10722, maxTokenYPay: 10, minTokenYPay: 9.996501225 });
  });

  // TODO: High precision inputs
});

describe('Calculate sell limit details with base token input', () => {
  test('Low precision inputs', () => {
    const result = getLimitDetails({ market: testMarket, direction: 'sell', inputToken: 'base', inputs: { priceInput: '0.9', tokenXInput: '10', tokenYInput: '', postOnly: false } });
    expect(result.buy).toEqual(defaultBuyLimitDetails);
    expect(result.sell).toEqual({ maxFee: 0.00315, price: 0.9, tokenXPay: 10, maxTokenYReceive: 9, minTokenYReceive: 8.99685 });
  });

  // TODO: High precision inputs
});

describe('Calculate sell limit details with quote token input', () => {
  test('Low precision inputs', () => {
    const result = getLimitDetails({ market: testMarket, direction: 'sell', inputToken: 'quote', inputs: { priceInput: '0.9', tokenXInput: '', tokenYInput: '10', postOnly: false } });
    expect(result.buy).toEqual(defaultBuyLimitDetails);
    expect(result.sell).toEqual({ maxFee: 0.003501226, price: 0.9, tokenXPay: 11.11501, maxTokenYReceive: 10.003501225, minTokenYReceive: 10 });
  });

  // TODO: High precision inputs
});
