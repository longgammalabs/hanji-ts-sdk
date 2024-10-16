import { HanjiSpotMarketContract } from './hanjiSpotMarketContract';
import { testMarket, testSigner } from '../helpers.test';
import BigNumber from 'bignumber.js';
import { PlaceOrderSpotParams } from './params';

describe('Place order', () => {
  let marketContract: HanjiSpotMarketContract;
  let mockedJestMarketContract: { placeOrder: jest.Mock };
  beforeEach(() => {
    marketContract = new HanjiSpotMarketContract({ market: testMarket, signer: testSigner });
    mockedJestMarketContract = { placeOrder: jest.fn() };
    (marketContract as any)['processContractMethodCall'] = jest.fn(() => 'transaction hash');
    (marketContract as any)['marketContract'] = mockedJestMarketContract;
  });

  test('Limit order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'bid',
      type: 'limit',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
      price: BigNumber(0.732),
    };
    const tx = await marketContract.placeOrder(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeOrder.mock.calls).toEqual([
      [
        false,
        2500000n,
        7320n,
        10000000n,
        false,
        false,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });

  test('Limit post only order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'bid',
      type: 'limit_post_only',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
      price: BigNumber(0.732),
    };
    const tx = await marketContract.placeOrder(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeOrder.mock.calls).toEqual([
      [
        false,
        2500000n,
        7320n,
        10000000n,
        false,
        true,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });

  test('Market ioc order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'ask',
      type: 'ioc',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
      price: BigNumber(0.732),
    };
    const tx = await marketContract.placeOrder(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeOrder.mock.calls).toEqual([
      [
        true,
        2500000n,
        7320n,
        10000000n,
        true,
        false,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });

  test('Market execution order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'ask',
      type: 'market_execution',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
    };
    const tx = await marketContract.placeOrder(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeOrder.mock.calls).toEqual([
      [
        true,
        2500000n,
        1n,
        10000000n,
        true,
        false,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });
});

describe('Place market order with target value', () => {
  let marketContract: HanjiSpotMarketContract;
  let mockedJestMarketContract: { placeMarketOrderWithTargetValue: jest.Mock };
  beforeEach(() => {
    marketContract = new HanjiSpotMarketContract({ market: testMarket, signer: testSigner });
    mockedJestMarketContract = { placeMarketOrderWithTargetValue: jest.fn() };
    (marketContract as any)['processContractMethodCall'] = jest.fn(() => 'transaction hash');
    (marketContract as any)['marketContract'] = mockedJestMarketContract;
  });

  test('Ioc order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'ask',
      type: 'ioc',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
      price: BigNumber(0.732),
    };
    const tx = await marketContract.placeMarketOrderWithTargetValue(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeMarketOrderWithTargetValue.mock.calls).toEqual([
      [
        true,
        25000000000n,
        7320n,
        10000000n,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });

  test('Market execution order', async () => {
    const params: PlaceOrderSpotParams = {
      market: testMarket.orderbookAddress,
      side: 'bid',
      type: 'market_execution',
      size: BigNumber(25),
      maxCommission: BigNumber(0.01),
    };
    const tx = await marketContract.placeMarketOrderWithTargetValue(params);
    expect(tx).toBe('transaction hash');
    expect(mockedJestMarketContract.placeMarketOrderWithTargetValue.mock.calls).toEqual([
      [
        false,
        25000000000n,
        999999000000000000000n,
        10000000n,
        true,
        expect.any(BigInt),
        {
          value: 0n,
          gasLimit: undefined,
          nonce: undefined,
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        },
      ],
    ]);
  });
});
