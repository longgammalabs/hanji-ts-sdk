import BigNumber from 'bignumber.js';
import { ethers, type Provider, type Wallet } from 'ethers';

import { HanjiClient, type Order } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { expectOrder, transactionRegex, waitAtLeastNOrders } from '../../testHelpers';
import { erc20Abi } from '../../../src/abi';

describe('Hanji Spot Place Limit Order API', () => {
  let testConfig: TestConfig;
  let provider: Provider;
  let wallet: Wallet;
  let hanjiClient: HanjiClient;

  beforeAll(async () => {
    testConfig = getTestConfig();
    provider = new ethers.JsonRpcProvider(testConfig.rpcUrl);
    wallet = new ethers.Wallet(testConfig.accountPrivateKey, provider);
    // check if user has 5 unit of each token for interacting
    let contract = new ethers.Contract(testConfig.testMarkets.xtzUsd.baseToken.contractAddress, erc20Abi, provider);
    let balance = await contract.balanceOf!(wallet.address);
    if (balance < 5n * (10n ** BigInt(testConfig.testMarkets.xtzUsd.baseToken.decimals))) {
      throw new Error('User does not have 5 unit of base token');
    }
    contract = new ethers.Contract(testConfig.testMarkets.xtzUsd.quoteToken.contractAddress, erc20Abi, provider);
    balance = await contract.balanceOf!(wallet.address);
    if (balance < 5n * (10n ** BigInt(testConfig.testMarkets.xtzUsd.quoteToken.decimals))) {
      throw new Error('User does not have 5 unit of quote token');
    }
  }, 15_000);

  beforeEach(async () => {
    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      signer: wallet,
      webSocketConnectImmediately: false,
    });
  });

  test('Batch place, change and cancel.', async () => {
    const market = testConfig.testMarkets.xtzUsd.orderbookAddress;
    let tx = await hanjiClient.spot.approveTokens({
      market,
      isBaseToken: false,
      amount: BigNumber(0.15),
    });
    expect(tx.hash).toMatch(transactionRegex);
    tx = await hanjiClient.spot.approveTokens({
      market,
      isBaseToken: true,
      amount: BigNumber(1.25),
    });
    expect(tx.hash).toMatch(transactionRegex);
    tx = await hanjiClient.spot.batchPlaceOrder({
      market,
      type: 'limit',
      orderParams: [
        {
          side: 'ask',
          size: BigNumber(0.1),
          price: BigNumber(2.5),
        },
        {
          side: 'ask',
          size: BigNumber(0.2),
          price: BigNumber(2.5),
        },
        {
          side: 'ask',
          size: BigNumber(0.2),
          price: BigNumber(2.5),
        },
        {
          side: 'bid',
          size: BigNumber(0.2),
          price: BigNumber(0.3),
        },
        {
          side: 'bid',
          size: BigNumber(0.3),
          price: BigNumber(0.3),
        },
      ],
    });
    expect(tx.hash).toMatch(transactionRegex);

    const newOrders = await waitAtLeastNOrders(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address, status: 'open' }),
      (o: Order) => o.txnHash === tx.hash,
      5
    );
    if (!newOrders) throw Error('New orders not found');
    newOrders.sort((left, right) => left.logIndex - right.logIndex);
    expectOrder(newOrders[0], {
      market: { id: market },
      type: 'limit',
      side: 'ask',
      status: 'open',
      rawPrice: 25000n,
      price: new BigNumber(2.5),
      rawSize: 10n,
      size: new BigNumber(0.1),
      rawOrigSize: 10n,
      origSize: new BigNumber(0.1),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });
    expectOrder(newOrders[1], {
      market: { id: market },
      type: 'limit',
      side: 'ask',
      status: 'open',
      rawPrice: 25000n,
      price: new BigNumber(2.5),
      rawSize: 20n,
      size: new BigNumber(0.2),
      rawOrigSize: 20n,
      origSize: new BigNumber(0.2),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });
    expectOrder(newOrders[2], {
      market: { id: market },
      type: 'limit',
      side: 'ask',
      status: 'open',
      rawPrice: 25000n,
      price: new BigNumber(2.5),
      rawSize: 20n,
      size: new BigNumber(0.2),
      rawOrigSize: 20n,
      origSize: new BigNumber(0.2),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });
    expectOrder(newOrders[3], {
      market: { id: market },
      type: 'limit',
      side: 'bid',
      status: 'open',
      rawPrice: 3000n,
      price: new BigNumber(0.3),
      rawSize: 20n,
      size: new BigNumber(0.2),
      rawOrigSize: 20n,
      origSize: new BigNumber(0.2),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });
    expectOrder(newOrders[4], {
      market: { id: market },
      type: 'limit',
      side: 'bid',
      status: 'open',
      rawPrice: 3000n,
      price: new BigNumber(0.3),
      rawSize: 30n,
      size: new BigNumber(0.3),
      rawOrigSize: 30n,
      origSize: new BigNumber(0.3),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });

    // batch change third and fourth orders
    tx = await hanjiClient.spot.approveTokens({
      market,
      isBaseToken: false,
      amount: BigNumber(0.99),
    });
    expect(tx.hash).toMatch(transactionRegex);
    tx = await hanjiClient.spot.approveTokens({
      market,
      isBaseToken: true,
      amount: BigNumber(4.8),
    });
    expect(tx.hash).toMatch(transactionRegex);
    tx = await hanjiClient.spot.batchChangeOrder({
      market,
      orderParams: [
        {
          orderId: newOrders[3]!.orderId,
          newSize: BigNumber(0.3),
          newPrice: BigNumber(0.33),
        },
        {
          orderId: newOrders[2]!.orderId,
          newSize: BigNumber(2),
          newPrice: BigNumber(2.4),
        },
      ],
      type: 'limit',
    });
    expect(tx.hash).toMatch(transactionRegex);

    const changedOrders = await waitAtLeastNOrders(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address, status: 'open' }),
      (o: Order) => o.txnHash === tx.hash,
      2
    );
    if (!changedOrders) throw Error('Changed orders not found');
    changedOrders.sort((left, right) => left.logIndex - right.logIndex);

    expectOrder(changedOrders[0], {
      market: { id: market },
      type: 'limit',
      side: 'bid',
      status: 'open',
      rawPrice: 3300n,
      price: new BigNumber(0.33),
      rawSize: 30n,
      size: new BigNumber(0.3),
      rawOrigSize: 30n,
      origSize: new BigNumber(0.3),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });
    expectOrder(changedOrders[1], {
      market: { id: market },
      type: 'limit',
      side: 'ask',
      status: 'open',
      rawPrice: 24000n,
      price: new BigNumber(2.4),
      rawSize: 200n,
      size: new BigNumber(2),
      rawOrigSize: 200n,
      origSize: new BigNumber(2),
      rawClaimed: 0n,
      claimed: new BigNumber(0),
      owner: wallet.address.toLowerCase(),
    });

    // orders have new ids
    expect(changedOrders[0]!.orderId).not.toEqual(newOrders[3]!.orderId);
    expect(changedOrders[1]!.orderId).not.toEqual(newOrders[2]!.orderId);

    // cancel open orders
    let openedOrders = await hanjiClient.spot.getOrders({ market, user: wallet.address, status: 'open' });
    tx = await hanjiClient.spot.batchClaim({
      market,
      claimParams: openedOrders.map(order => ({ address: wallet.address, orderId: order.orderId })),
      onlyClaim: false,
    });
    expect(tx.hash).toMatch(transactionRegex);

    openedOrders = await hanjiClient.spot.getOrders({ market, user: wallet.address, status: 'open' });
    expect(openedOrders.length).toBe(0);
  }, 60_000);
});
