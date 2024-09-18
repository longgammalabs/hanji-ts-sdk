import BigNumber from 'bignumber.js';
import { ethers, type ContractTransactionResponse, type Provider, type Wallet } from 'ethers';

import { HanjiClient, PlaceOrderSpotParams, type Order, PlaceOrderWithPermitSpotParams, OrderType, Side } from '../../../src';
import { getTestConfig, type TestConfig } from '../../testConfig';
import { expectOrder, transactionRegex, waitForOrder } from '../../testHelpers';
import { erc20Abi } from '../../../src/abi';

class LoggingProvider extends ethers.JsonRpcProvider {
  async send(method: any, args: any): Promise<any> {
    console.log('>>>', method, args);
    return super.send(method, args).then(result => {
      console.log('<<<', method, args, result);
      return result;
    });
  }
}

describe('Hanji Spot Client Contract API', () => {
  let testConfig: TestConfig;
  let provider: Provider;
  let wallet: Wallet;
  let hanjiClient: HanjiClient;

  beforeAll(async () => {
    testConfig = getTestConfig();
    provider = new LoggingProvider(testConfig.rpcUrl);
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
  }, 45_000);

  beforeEach(async () => {
    hanjiClient = new HanjiClient({
      apiBaseUrl: testConfig.hanjiApiBaseUrl,
      webSocketApiBaseUrl: testConfig.hanjiWebsocketBaseUrl,
      signer: wallet,
      webSocketConnectImmediately: false,
    });
  });

  test.only('check timing', async () => {
    const { market, approveAmount, newOrderParams } = {
      market: testConfig.testMarkets.xtzUsd.id,
      approveAmount: new BigNumber(0.5),
      newOrderParams: {
        market: testConfig.testMarkets.xtzUsd.id,
        type: 'limit' as OrderType,
        side: 'ask' as Side,
        price: new BigNumber(117),
        size: new BigNumber(0.5),
        useNativeToken: false,
        maxCommission: new BigNumber(1),
        quantityToSend: 0n,
      },
    };
    let tx: ContractTransactionResponse;

    const startTime = Date.now();
    tx = await hanjiClient.spot.approveTokens({
      market,
      amount: approveAmount,
      isBaseToken: newOrderParams.side === 'ask',
    });
    const endTime = Date.now();
    console.log(`approveTokens execution time: ${endTime - startTime} ms`);
    expect(tx.hash).toMatch(transactionRegex);

    const startTime2 = Date.now();
    tx = await hanjiClient.spot.placeOrder(newOrderParams);
    const endTime2 = Date.now();
    console.log(`placeOrder execution time: ${endTime2 - startTime2} ms`);
    expect(tx.hash).toMatch(transactionRegex);
    expect(tx.hash).toMatch(transactionRegex);

    const newOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.txnHash === tx.hash
    );
    console.log('newOrder', newOrder?.txnHash);

    tx = await hanjiClient.spot.claimOrder({
      market,
      orderId: newOrder!.orderId,
      onlyClaim: false,
    });
    expect(tx.hash).toMatch(transactionRegex);

    const canceledOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.orderId === newOrder!.orderId && o.status === 'cancelled'
    );
    console.log('canceledOrder', canceledOrder?.txnHash);
  }, 30000);

  test.each(
    [
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        approveAmount: new BigNumber(0.5),
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'ask',
          price: new BigNumber(117),
          size: new BigNumber(0.5),
          useNativeToken: false,
          maxCommission: new BigNumber(1),
          quantityToSend: 0n,
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'ask',
          rawPrice: 1170000n,
          price: new BigNumber(117),
          rawSize: 500n,
          size: new BigNumber(0.5),
          rawOrigSize: 500n,
          origSize: new BigNumber(0.5),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'ask',
          rawPrice: 1170000n,
          price: new BigNumber(117),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 500n,
          origSize: new BigNumber(0.5),
          rawClaimed: 500n,
          claimed: new BigNumber(0.5),
          owner: wallet.address.toLowerCase(),
        },
      }),
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        approveAmount: new BigNumber(0.035),
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'bid',
          price: new BigNumber(0.01),
          size: new BigNumber(0.035),
          useNativeToken: false,
          maxCommission: new BigNumber(1),
          quantityToSend: 0n,
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'open',
          rawPrice: 100n,
          price: new BigNumber(0.01),
          rawSize: 35n,
          size: new BigNumber(0.035),
          rawOrigSize: 35n,
          origSize: new BigNumber(0.035),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'cancelled',
          rawPrice: 100n,
          price: new BigNumber(0.01),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 35n,
          origSize: new BigNumber(0.035),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
      }),
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        approveAmount: 770n * (10n ** 15n),
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'ask',
          price: 3170000n,
          size: 770n,
          maxCommission: new BigNumber(1),
          quantityToSend: 0n,
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'ask',
          rawPrice: 3170000n,
          price: new BigNumber(317),
          rawSize: 770n,
          size: new BigNumber(0.77),
          rawOrigSize: 770n,
          origSize: new BigNumber(0.77),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'ask',
          rawPrice: 3170000n,
          price: new BigNumber(317),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 770n,
          origSize: new BigNumber(0.77),
          rawClaimed: 770n,
          claimed: new BigNumber(0.77),
          owner: wallet.address.toLowerCase(),
        },
      }),
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        approveAmount: 1n * (10n ** 13n),
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'bid',
          price: 1n,
          size: 1n,
          maxCommission: new BigNumber(1),
          quantityToSend: 0n,
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'open',
          rawPrice: 1n,
          price: new BigNumber(0.0001),
          rawSize: 1n,
          size: new BigNumber(0.001),
          rawOrigSize: 1n,
          origSize: new BigNumber(0.001),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'cancelled',
          rawPrice: 1n,
          price: new BigNumber(0.0001),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 1n,
          origSize: new BigNumber(0.001),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
      }),
    ] as Array<(testConfig: TestConfig, wallet: Wallet) => {
      market: string;
      approveAmount: BigNumber | bigint;
      newOrderParams: PlaceOrderSpotParams;
      expectedNewOrder: Partial<Order>;
      expectedCancelOrder: Partial<Order>;
    }>
  )('Post a new limit order and cancel it', async getTestCase => {
    const { market, approveAmount, newOrderParams, expectedNewOrder, expectedCancelOrder } = getTestCase(testConfig, wallet);
    let tx: ContractTransactionResponse;

    tx = await hanjiClient.spot.approveTokens({
      market,
      amount: approveAmount,
      isBaseToken: newOrderParams.side === 'ask',
    });
    expect(tx.hash).toMatch(transactionRegex);

    tx = await hanjiClient.spot.placeOrder(newOrderParams);
    expect(tx.hash).toMatch(transactionRegex);

    const newOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.txnHash === tx.hash
    );
    expectOrder(newOrder, expectedNewOrder);

    tx = await hanjiClient.spot.claimOrder({
      market,
      orderId: newOrder!.orderId,
      onlyClaim: false,
    });
    expect(tx.hash).toMatch(transactionRegex);

    const canceledOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.orderId === newOrder!.orderId && o.status === 'cancelled'
    );
    expectOrder(canceledOrder, expectedCancelOrder);
  }, 45_000);

  test.each(
    [
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'bid',
          price: new BigNumber(0.01),
          size: new BigNumber(1),
          maxCommission: new BigNumber(0),
          permit: new BigNumber(0.01),
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          rawPrice: 100n,
          price: new BigNumber(0.01),
          rawSize: 1000n,
          size: new BigNumber(1),
          rawOrigSize: 1000n,
          origSize: new BigNumber(1),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          rawPrice: 100n,
          price: new BigNumber(0.01),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 1000n,
          origSize: new BigNumber(1),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
      }),
      (testConfig, wallet) => ({
        market: testConfig.testMarkets.xtzUsd.id,
        newOrderParams: {
          market: testConfig.testMarkets.xtzUsd.id,
          type: 'limit',
          side: 'bid',
          price: 1n,
          size: 1n,
          maxCommission: 0n,
          permit: 1n * (10n ** 13n),
        },
        expectedNewOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'open',
          rawPrice: 1n,
          price: new BigNumber(0.0001),
          rawSize: 1n,
          size: new BigNumber(0.001),
          rawOrigSize: 1n,
          origSize: new BigNumber(0.001),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
        expectedCancelOrder: {
          market: {
            id: testConfig.testMarkets.xtzUsd.id,
          },
          type: 'limit',
          side: 'bid',
          status: 'cancelled',
          rawPrice: 1n,
          price: new BigNumber(0.0001),
          rawSize: 0n,
          size: new BigNumber(0),
          rawOrigSize: 1n,
          origSize: new BigNumber(0.001),
          rawClaimed: 0n,
          claimed: new BigNumber(0),
          owner: wallet.address.toLowerCase(),
        },
      }),
    ] as Array<(testConfig: TestConfig, wallet: Wallet) => {
      market: string;
      newOrderParams: PlaceOrderWithPermitSpotParams;
      expectedNewOrder: Partial<Order>;
      expectedCancelOrder: Partial<Order>;
    }>
  )('Post a new limit order with permit and cancel it', async getTestCase => {
    const { market, newOrderParams, expectedNewOrder, expectedCancelOrder } = getTestCase(testConfig, wallet);
    let tx: ContractTransactionResponse;
    tx = await hanjiClient.spot.placeOrderWithPermit(newOrderParams);

    const newOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.txnHash === tx.hash
    );
    expectOrder(newOrder, expectedNewOrder);

    tx = await hanjiClient.spot.claimOrder({
      market,
      orderId: newOrder!.orderId,
      onlyClaim: false,
    });
    expect(tx.hash).toMatch(transactionRegex);

    const canceledOrder = await waitForOrder(
      () => hanjiClient.spot.getOrders({ market, user: wallet.address }),
      o => o.orderId === newOrder!.orderId && o.status === 'cancelled'
    );
    expectOrder(canceledOrder, expectedCancelOrder);
  }, 60_000);
});
