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
      if (market.lastPrice)
        expect(market.lastPrice).toEqual(testConfig.testMarkets.xtzUsd.lastPrice);
      if (market.lowPrice24h)
        expect(market.lowPrice24h).toEqual(testConfig.testMarkets.xtzUsd.lowPrice24h);
      if (market.highPrice24h)
        expect(market.highPrice24h).toEqual(testConfig.testMarkets.xtzUsd.highPrice24h);
      if (market.bestAsk)
        expect(market.bestAsk).toEqual(testConfig.testMarkets.xtzUsd.bestAsk);
      if (market.bestBid)
        expect(market.bestBid).toEqual(testConfig.testMarkets.xtzUsd.bestBid);
      expect(market.tradingVolume24h).toEqual(testConfig.testMarkets.xtzUsd.tradingVolume24h);
      expect(market.lastTouched).toEqual(testConfig.testMarkets.xtzUsd.lastTouched);
      expect(market.baseToken).toEqual(testConfig.testMarkets.xtzUsd.baseToken);
      expect(market.quoteToken).toEqual(testConfig.testMarkets.xtzUsd.quoteToken);
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
    // no market data for now
    expect(candles).toEqual([]);
  });
});
