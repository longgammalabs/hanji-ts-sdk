import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { wait } from '../../testHelpers';

describe('Hanji Spot WebSocket Client', () => {
  let testConfig: TestConfig;
  let hanjiClient: HanjiClient;

  beforeAll(() => {
    testConfig = getTestConfig();

    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      signer: null,
      webSocketConnectImmediately: false,
    });
  });

  test('check candles subscription exists', async () => {
    const subscriptionErrorListener = jest.fn();
    hanjiClient.spot.events.subscriptionError.addListener(subscriptionErrorListener);
    hanjiClient.spot.subscribeToCandles({ market: testConfig.testMarkets.xtzUsd.id, resolution: '1D' });
    await wait(1000);
    hanjiClient.spot.unsubscribeFromCandles({ market: testConfig.testMarkets.xtzUsd.id, resolution: '1D' });
    expect(subscriptionErrorListener).not.toHaveBeenCalled();
    hanjiClient.spot.events.subscriptionError.removeListener(subscriptionErrorListener);
    // TODO: need jest 30.0.0
    // hanjiClient.spot[Symbol.dispose]();
  });
});
