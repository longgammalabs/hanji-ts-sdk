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
    const marketId = testConfig.testMarkets.xtzUsd.id;
    const market = await hanjiClient.spot.getMarket({ market: marketId });
    if (market) {
      expect(market.orderbookAddress).toBe(marketId);
      expect(market.tokenXScalingFactor).toBe(testConfig.testMarkets.xtzUsd.tokenXScalingFactor);
      expect(market.tokenYScalingFactor).toBe(testConfig.testMarkets.xtzUsd.tokenYScalingFactor);
      expect(market.priceScalingFactor).toBe(testConfig.testMarkets.xtzUsd.priceScalingFactor);
      expect(market.lastPrice).toEqual(testConfig.testMarkets.xtzUsd.lastPrice);
      expect(market.lowPrice24h).toEqual(testConfig.testMarkets.xtzUsd.lowPrice24h);
      expect(market.highPrice24h).toEqual(testConfig.testMarkets.xtzUsd.highPrice24h);
      expect(market.bestAsk).toEqual(testConfig.testMarkets.xtzUsd.bestAsk);
      expect(market.bestBid).toEqual(testConfig.testMarkets.xtzUsd.bestBid);
      expect(market.tradingVolume24h).toEqual(testConfig.testMarkets.xtzUsd.tradingVolume24h);
      expect(market.lastTouched).toEqual(testConfig.testMarkets.xtzUsd.lastTouched);
    }
    else {
      throw new Error('market is undefined');
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
