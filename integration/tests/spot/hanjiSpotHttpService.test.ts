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
      signerOrProvider: signer,
      webSocketConnectImmediately: false,
    });
  });

  test('get xtzusd market info', async () => {
    const market = testConfig.testMarkets.xtzUsd.id;
    const marketInfo = await hanjiClient.spot.getMarketInfo({ market });
    if (marketInfo) {
      expect(marketInfo.orderbookAddress).toBe(market);
      expect(marketInfo.scalingFactors.baseToken).toBe(testConfig.testMarkets.xtzUsd.tokenXScalingFactor);
      expect(marketInfo.scalingFactors.quoteToken).toBe(testConfig.testMarkets.xtzUsd.tokenYScalingFactor);
      expect(marketInfo.scalingFactors.price).toBe(testConfig.testMarkets.xtzUsd.priceScalingFactor);
      expect(marketInfo.lastPrice).toEqual(testConfig.testMarkets.xtzUsd.lastPrice);
      expect(marketInfo.lowPrice24h).toEqual(testConfig.testMarkets.xtzUsd.lowPrice24h);
      expect(marketInfo.highPrice24h).toEqual(testConfig.testMarkets.xtzUsd.highPrice24h);
      expect(marketInfo.bestAsk).toEqual(testConfig.testMarkets.xtzUsd.bestAsk);
      expect(marketInfo.bestBid).toEqual(testConfig.testMarkets.xtzUsd.bestBid);
      expect(marketInfo.tradingVolume24h).toEqual(testConfig.testMarkets.xtzUsd.tradingVolume24h);
      expect(marketInfo.lastTouched).toEqual(testConfig.testMarkets.xtzUsd.lastTouched);
    }
    else {
      throw new Error('marketInfo is undefined');
    }
  });

  test('get candles data', async () => {
    const candles = await hanjiClient.spot.getCandles({
      market: testConfig.testMarkets.xtzUsd.id,
      resolution: '60',
      toTime: 1721966400000,
      fromTime: 1721955600000,
    });
    expect(candles).toEqual([
      { resolution: '60', time: 1721955600000, open: '7560', high: '7560', low: '7560', close: '7560', volume: '0' },
      { resolution: '60', time: 1721959200000, open: '7560', high: '7560', low: '7560', close: '7560', volume: '0' },
      { resolution: '60', time: 1721962800000, open: '7560', high: '7560', low: '7560', close: '7560', volume: '0' },
      { resolution: '60', time: 1721966400000, open: '7560', high: '7560', low: '7560', close: '7560', volume: '0' },
    ]);
  });
});
