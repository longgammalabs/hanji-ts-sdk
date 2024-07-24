import { ethers, type Signer } from 'ethers';
import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';

describe('Hanji Spot HTTP Client', () => {
  let testConfig: TestConfig;
  let signer: Signer;
  let hanjiClient: HanjiClient;

  beforeAll(() => {
    testConfig = getTestConfig();
    signer = new ethers.VoidSigner('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');

    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      singerOrProvider: signer,
      webSocketConnectImmediately: false,
    });
  });

  test('get xtzusd market info', async () => {
    const market = testConfig.testMarkets.xtzUsd.id;
    const marketInfo = await hanjiClient.spot.getMarketInfo({ market });
    if (marketInfo) {
      expect(marketInfo.orderbookAddress).toBe(market);
      expect(marketInfo.baseToken).toBeDefined();
      expect(marketInfo.quoteToken).toBeDefined();
    }
    else {
      throw new Error('marketInfo is undefined');
    }
  });

  test('get candles data', async () => {
    const candles = await hanjiClient.spot.getCandles({
      market: testConfig.testMarkets.xtzUsd.id,
      resolution: '1D',
      toTime: 1721260800000,
      fromTime: 1720828800000,
    });
    expect(candles).toEqual([
      { resolution: '1D', time: 1720828800000, open: '7697', high: '8000', low: '7240', close: '7847', volume: '133260' },
      { resolution: '1D', time: 1720915200000, open: '7847', high: '8100', low: '7240', close: '7930', volume: '136892' },
      { resolution: '1D', time: 1721001600000, open: '7930', high: '8600', low: '7230', close: '7950', volume: '94439' },
      { resolution: '1D', time: 1721088000000, open: '7950', high: '8600', low: '7950', close: '8233', volume: '75979' },
      { resolution: '1D', time: 1721174400000, open: '8233', high: '8371', low: '8036', close: '8053', volume: '146712' },
      { resolution: '1D', time: 1721260800000, open: '8053', high: '8241', low: '8026', close: '8073', volume: '66186' },
    ]);
  });
});
