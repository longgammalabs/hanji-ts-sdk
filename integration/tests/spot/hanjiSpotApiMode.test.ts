import BigNumber from 'bignumber.js';
import { ethers, type ContractTransactionResponse, type Provider, type Wallet } from 'ethers';

import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { transactionRegex } from '../../testHelpers';

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
      singerOrProvider: wallet,
      webSocketConnectImmediately: false,
    });
  });

  test.each([
    // isBaseToken, approveTokensAmount, baseTokenAmount, quoteTokenAmount
    [true, new BigNumber(1), new BigNumber(1), new BigNumber(0)],
    [false, new BigNumber(1), new BigNumber(0), new BigNumber(1)],
    [true, 1_000n * (10n ** 18n), 1_000n, 0n],
    [false, 1_000n * (10n ** 18n), 0n, 1_000n],
  ])('Deposit and Withdraw [base: %i, quote: %i]', async (isBaseToken, approveTokensAmount, baseTokenAmount, quoteTokenAmount) => {
    const market = testConfig.testMarkets.xtzUsd.id;
    let tx: ContractTransactionResponse;

    tx = await hanjiClient.spot.approveTokens({
      market,
      amount: approveTokensAmount,
      isBaseToken,
    });
    expect(tx.hash).toMatch(transactionRegex);

    tx = await hanjiClient.spot.depositTokens({
      market,
      baseTokenAmount,
      quoteTokenAmount,
    });
    expect(tx.hash).toMatch(transactionRegex);

    tx = await hanjiClient.spot.withdrawTokens({
      market,
      baseTokenAmount,
      quoteTokenAmount,
    });
    expect(tx.hash).toMatch(transactionRegex);
  });
});
