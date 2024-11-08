import BigNumber from 'bignumber.js';
import { ethers, type ContractTransactionResponse, type Provider, type Wallet } from 'ethers';

import { HanjiClient } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { transactionRegex } from '../../testHelpers';
import { erc20Abi } from '../../../src/abi';

describe('Hanji Spot Client Contract API', () => {
  let testConfig: TestConfig;
  let provider: Provider;
  let wallet: Wallet;
  let hanjiClient: HanjiClient;

  beforeAll(async () => {
    testConfig = getTestConfig();
    provider = new ethers.JsonRpcProvider(testConfig.rpcUrl);
    wallet = new ethers.Wallet(testConfig.accountPrivateKey, provider);
    // check if user has 1 unit of each token for interacting
    let contract = new ethers.Contract(testConfig.testMarkets.xtzUsd.baseToken.contractAddress, erc20Abi, provider);
    let balance = await contract.balanceOf!(wallet.address);
    if (balance < 1n * (10n ** BigInt(testConfig.testMarkets.xtzUsd.baseToken.decimals))) {
      throw new Error('User does not have 1 unit of base token');
    }
    contract = new ethers.Contract(testConfig.testMarkets.xtzUsd.quoteToken.contractAddress, erc20Abi, provider);
    balance = await contract.balanceOf!(wallet.address);
    if (balance < 1n * (10n ** BigInt(testConfig.testMarkets.xtzUsd.quoteToken.decimals))) {
      throw new Error('User does not have 1 unit of base token');
    }
    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      signer: wallet,
      webSocketConnectImmediately: false,
    });
  }, 15_000);

  test.each([
    // isBaseToken, approveTokensAmount, baseTokenAmount, quoteTokenAmount
    [true, new BigNumber(1), new BigNumber(1), new BigNumber(0)],
    [false, new BigNumber(1), new BigNumber(0), new BigNumber(1)],
    [true, 1n * (10n ** 17n), 10n, 0n],
    [false, 1_000n, 0n, 1_000n],
  ])('Deposit and Withdraw [isBase: %p, approve: %i, base: %i, quote: %i]', async (isBaseToken, approveTokensAmount, baseTokenAmount, quoteTokenAmount) => {
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
  }, 30_000);
});
