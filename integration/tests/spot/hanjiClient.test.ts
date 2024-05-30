import { ethers, type Provider, type Wallet } from 'ethers';

import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';

describe('Hanji Spot Client', () => {
  let testConfig: TestConfig;
  let provider: Provider;
  let wallet: Wallet;
  let hanjiClient: HanjiClient;

  beforeAll(() => {
    testConfig = getTestConfig();
    provider = new ethers.JsonRpcProvider(testConfig.rpcUrl);
    wallet = new ethers.Wallet(testConfig.accountPrivateKey, provider);
  });

  beforeEach(async () => {
    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      singerOrProvider: wallet
    });
  });

  test('Get spot clients', async () => {
    const xtzUsdMarketClient = await hanjiClient.spot.getMarket('0x3989e9215fc8f6b320e48156d184cccd10ad5443');

    expect(xtzUsdMarketClient).toMatchObject({
      options: {
        name: 'XTZeUSD',
        marketContractAddress: '0x3989e9215fc8f6b320e48156d184cccd10ad5443',
        baseToken: {
          id: 'XTZ',
          name: 'XTZ',
          symbol: 'XTZ',
          contractAddress: '0xb1ea698633d57705e93b0e40c1077d46cd6a51d8',
          scalingFactor: 3,
          decimals: 18,
          roundingDecimals: 2
        },
        quoteToken: {
          id: 'eUSD',
          name: 'eUSD',
          symbol: 'eUSD',
          contractAddress: '0x1a71f491fb0ef77f13f8f6d2a927dd4c969ece4f',
          scalingFactor: 5,
          decimals: 18,
          roundingDecimals: 2
        }
      }
    });
  });
});
