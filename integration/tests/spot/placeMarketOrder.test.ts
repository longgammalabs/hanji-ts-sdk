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

  test('Send market buy and sell orders', async () => {
    const market = testConfig.testMarkets.xtzUsd.id;
    let tx: ContractTransactionResponse;

    const info = await hanjiClient.spot.getMarket({ market });
    expect(info).toBeDefined();
    expect(info?.bestBid).not.toBeNull();
    tx = await hanjiClient.spot.placeMarketOrderWithTargetValue({
      market,
      side: 'ask',
      price: info!.bestBid as BigNumber,
      maxCommission: BigNumber(1),
      size: BigNumber(0.1),
      quantityToSend: BigNumber(1),
      transferExecutedTokens: true,
    });
    expect(tx.hash).toMatch(transactionRegex);

    expect(info?.bestAsk).not.toBeNull();
    tx = await hanjiClient.spot.placeMarketOrderWithTargetValueWithPermit({
      market,
      side: 'bid',
      price: info!.bestAsk as BigNumber,
      maxCommission: BigNumber(1),
      size: BigNumber(0.1),
      permit: BigNumber(0.1),
      transferExecutedTokens: true,
    });
    expect(tx.hash).toMatch(transactionRegex);
  }, 30_000);
});
