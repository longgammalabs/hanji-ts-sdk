import { ethers, type Signer } from 'ethers';
import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { wait } from '../../testHelpers';

describe('Hanji Spot WebSocket Client', () => {
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
