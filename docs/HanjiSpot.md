# HanjiSpot

## Overview

The `HanjiSpot` class is designed for interacting with the Hanji Spot API. It provides methods for retrieving market information, subscribing to market updates, placing orders, managing user orders and fills, and more.

## approveTokens

```typescript
async approveTokens({ market, token, amount }: ApproveSpotParams): Promise<ContractTransactionResponse>
```

Approves the specified amount of tokens for the corresponding market contract.

- `market`: The market identifier.
- `token`: The token to be approved.
- `amount`: The amount of tokens to approve. If `bigint` is provided, then the token's contract unit is used. If `BigNumber` is provided, then the scaled unit with the token's decimals is used.

## depositTokens

```typescript
async depositTokens({ market, token, amount }: DepositSpotParams): Promise<ContractTransactionResponse>
```

Deposits the specified amount of tokens to the corresponding market contract.

- `market`: The market identifier.
- `token`: The token to be deposited.
- `amount`: The amount of tokens to deposit. The Hanji scaled units are used.

## withdrawTokens

```typescript
async withdrawTokens({ bmarket, aseTokenAmount, quoteTokenAmount, withdrawAll }: WithdrawSpotParams): Promise<ContractTransactionResponse>
```

Withdraws the specified amount of tokens or all tokens from the corresponding market contract.

- `market`: The market identifier.
- `baseTokenAmount`: The amount of base tokens to withdraw. If `bigint` is provided, then the token's contract unit is used. If `BigNumber` is provided, then the scaled unit with the token's decimals is used. Optional if `withdrawAll` is true.
- `quoteTokenAmount`: The amount of quote tokens to withdraw. If `bigint` is provided, then the token's contract unit is used. If `BigNumber` is provided, then the scaled unit with the token's decimals is used. Optional if `withdrawAll` is true.
- `withdrawAll`: A flag indicating whether to withdraw all tokens. If true, `baseTokenAmount` and `quoteTokenAmount` are ignored.


## setClaimableStatus

```typescript
async setClaimableStatus({ market, status }: SetClaimableStatusParams): Promise<ContractTransactionResponse>
```

Sets the claimable status for the corresponding market contract.

- `market`: The market identifier.
- `status`: The claimable status to be set.

## placeOrder

```typescript
async placeOrder({ market, side, size, price, type, transferExecutedTokens, maxCommission, quantityToSend, useNativeToken }: PlaceOrderSpotParams): Promise<ContractTransactionResponse>
```

Places a new order in the corresponding market contract.
It can place limit or market order and use native token if market supports it.

- `market`: The market identifier.
- `side`: The order side (buy or sell).
- `size`: The size of the order.
- `price`: The price of the order.
- `type`: The type of the order (e.g., limit, market).
- `transferExecutedTokens`: Whether to transfer executed tokens automatically.
- `maxCommission`:  The upper bound of commission to pay.
- `quantityToSend`: The amount of native token to send.
- `useNativeToken`: Use native token for the transaction instead of the wrapped token.

## placeOrderWithPermit

```typescript
async placeOrderWithPermit({ market, side, size, price, permit, type, transferExecutedTokens, maxCommission }: PlaceOrderWithPermitSpotParams): Promise<ContractTransactionResponse>
```

Places a new order with a permit in the corresponding market contract if the token supports ERC20Permit interface.

- `market`: The market identifier.
- `side`: The order side (buy or sell).
- `size`: The size of the order.
- `price`: The price of the order.
- `permit`: The quantity of tokens to permit for the order. Ussually the same value as the approve value.
- `type`: The type of the order (e.g., limit, market).
- `transferExecutedTokens`: Whether to transfer executed tokens automatically.
- `maxCommission`: The upper bound of commission to pay.

This method allows placing an order with a permit, which is useful for tokens that support permit functionality, enabling gasless approvals.

## placeMarketOrderWithTargetValue

```typescript
async placeMarketOrderWithTargetValue({ market, side, price, size, targetValue, maxCommission, useNativeToken }: PlaceMarketOrderWithTargetValueParams): Promise<ContractTransactionResponse>
```

Places a market order with a target value of the quote token in the corresponding market contract.

- `market`: The market identifier.
- `side`: The order side (buy or sell).
- `price`: The price of the order.
- `size`: The quote token value to spend.
- `targetValue`: The quote token value to spend.
- `maxCommission`: The upper bound of commission to pay.
- `useNativeToken`: Use native token for the transaction instead of the wrapped token.

This method allows placing a market order by specifying the target value of the quote token, which is useful for executing orders based on a specific value rather than base token quantity.

## placeMarketOrderWithTargetValueWithPermit

````typescript
async placeMarketOrderWithTargetValueWithPermit({ market, side, price, size, permit, maxCommission, useNativeToken }: PlaceMarketOrderWithTargetValueWithPermitParams): Promise<ContractTransactionResponse>
````

Places a market order with a target value of the quote token and a permit in the corresponding market contract.

- `market`: The market identifier.
- `side`: The order side (buy or sell).
- `price`: The price of the order.
- `size`: The quote token value to spend.
- `permit`: The quantity of tokens to permit for the order. Usually the same value as the approve value.
- `maxCommission`: The upper bound of commission to pay.
- `transferExecutedTokens`: Whether to transfer executed tokens automatically.

The same action as in `placeMarketOrderWithTargetValue` but it uses a token that supports permit.

## claimOrder

```typescript
async claimOrder({ market, orderId, transferExecutedTokens }: ClaimOrderSpotParams): Promise<ContractTransactionResponse>
```

Claims an order or fully cancels it in the corresponding market contract.

- `market`: The market identifier.
- `orderId`: The unique identifier of the order to be claimed.
- `transferExecutedTokens`: Whether to transfer executed tokens automatically.

## changeOrder

```typescript
async changeOrder({ market, orderId, newSize, newPrice, type, maxCommission, transferExecutedTokens }: ChangeOrderSpotParams): Promise<ContractTransactionResponse>
```

Changes an existing order in the corresponding market contract.

- `market`: The market identifier.
- `orderId`: The unique identifier of the order to be changed.
- `newSize`: The new size of the order.
- `newPrice`: The new price of the order.
- `type`: The type of the order (e.g., limit, limit_post_only).
- `transferExecutedTokens`: Whether to transfer executed tokens automatically.
- `maxCommission`: The upper bound of commission to pay.

## getMarket

```typescript
async getMarket({ market }: GetMarketParams): Promise<Market | undefined>
```

Retrieves the market information for the specified market.

- `market`: The market identifier.

## getMarkets

```typescript
async getMarkets({ market }: GetMarketsParams): Promise<Market[]>
```

Retrieves the markets.

- `market`: Optional market identifier to filter results.

## getTokens

```typescript
async getTokens({ token }: GetTokensParams): Promise<Token[]>
```

Retrieves the tokens.

- `token`: Optional token identifier to filter results.

## getOrderbook

```typescript
async getOrderbook({ market, aggregation, limit }: GetOrderbookParams): Promise<Orderbook>
```

Retrieves the orderbook for the specified market.

- `market`: The market identifier.
- `aggregation`: Optional level of price aggregation.
- `limit`: Optional limit on the number of orders to retrieve.

## getOrders

```typescript
async getOrders({ market, user, limit, status }: GetOrdersParams): Promise<Order[]>
```

Retrieves the orders for the specified market.

- `market`: The market identifier.
- `user`: The user's address.
- `limit`: Optional limit on the number of orders to retrieve.
- `status`: Optional filter for order status.

## getTrades

```typescript
async getTrades({ market, limit }: GetTradesParams): Promise<Trade[]>
```

Retrieves the trades for the specified market.

- `market`: The market identifier.
- `limit`: Optional limit on the number of trades to retrieve.

## getFills

```typescript
async getFills({ market, user, limit }: GetFillsParams): Promise<Fill[]>
```

Retrieves the fills for the specified market.

- `market`: The market identifier.
- `user`: The user's address.
- `limit`: Optional limit on the number of fills to retrieve.

## getCandles

```typescript
async getCandles({ market, resolution, fromTime, toTime }: GetCandlesParams): Promise<Candle[]>
```

Retrieves the candles for the specified market and resolution.

- `market`: The market identifier.
- `resolution`: The time resolution for the candles.
- `fromTime`: Optional start time for the candle data.
- `toTime`: Optional end time for the candle data.

## events

The `HanjiSpot.events` property defines various events that you can listen to for real-time updates. These events include:

- `marketUpdated`: Triggered when there is an update in the market.
- `orderbookUpdated`: Triggered when there is an update in the order book.
- `tradesUpdated`: Triggered when a new trade occurs.
- `userFillUpdated`: Triggered when a fill is updated.
- `userOrderUpdated`: Triggered when an order is updated.
- `candleUpdated`: Triggered when new candle data is available.
- `allMarketsUpdated`: Triggered when there is an update across any market.
- `subscriptionError`: Triggered when there is an error related to a subscription.

You can add event listeners to these events to handle real-time data as it comes in. Events start coming after ypu subscribe to them with certain methods

## HanjiSpot Subscription Methods

The HanjiSpot class also includes methods for subscribing to and unsubscribing from various market updates, such as `subscribeToMarket`, `unsubscribeFromMarket`, `subscribeToOrderbook`, `unsubscribeFromOrderbook`, etc. These methods interact with the WebSocket API to provide real-time updates.

## Market Subscriptions

### subscribeToMarket
```typescript
subscribeToMarket({ market }: { market: string }): void
```

Subscribes to updates for a specific market.

### unsubscribeFromMarket
```typescript
unsubscribeFromMarket({ market }: { market: string }): void
```

Unsubscribes from updates for a specific market.

### subscribeToAllMarkets
```typescript
subscribeToAllMarkets(): void
```

Subscribes to updates for all markets.

### unsubscribeFromAllMarkets
```typescript
unsubscribeFromAllMarkets(): void
```

Unsubscribes from updates for all markets.

## Orderbook Subscriptions

### subscribeToOrderbook
```typescript
subscribeToOrderbook({ market, aggregation }: { market: string, aggregation: number }): void
```

Subscribes to orderbook updates for a specific market.

### unsubscribeFromOrderbook
```typescript
unsubscribeFromOrderbook({ market, aggregation }: { market: string, aggregation: number }): void
```

Unsubscribes from orderbook updates for a specific market.

## Trade Subscriptions

### subscribeToTrades
```typescript
subscribeToTrades({ market }: { market: string }): void
```

Subscribes to trade updates for a specific market.

### unsubscribeFromTrades
```typescript
unsubscribeFromTrades({ market }: { market: string }): void
```

Unsubscribes from trade updates for a specific market.

## User Order Subscriptions

### subscribeToUserOrders
```typescript
subscribeToUserOrders({ user, market }: { user: string, market?: string }): void
```

Subscribes to user order updates for a specific market and user.

### unsubscribeFromUserOrders
```typescript
unsubscribeFromUserOrders({ user, market }: { user: string, market?: string }): void
```

Unsubscribes from user order updates for a specific market and user.

## User Fill Subscriptions

### subscribeToUserFills
```typescript
subscribeToUserFills({ user, market }: { user: string, market?: string }): void
```

Subscribes to user fill updates for a specific market and user.

### unsubscribeFromUserFills
```typescript
unsubscribeFromUserFills({ user, market }: { user: string, market?: string }): void
```

Unsubscribes from user fill updates for a specific market and user.

## Candle Subscriptions

### subscribeToCandles
```typescript
subscribeToCandles({ market, resolution }: { market: string, resolution: CandleResolution }): void
```

Subscribes to candle updates for a specific market and resolution.

### unsubscribeFromCandles
```typescript
unsubscribeFromCandles({ market, resolution }: { market: string, resolution: CandleResolution }): void
```

Unsubscribes from candle updates for a specific market and resolution.

## Examples

### Post a new order (view with HTTP API)

```ts
import { ethers, type ContractTransactionResponse } from 'ethers';
import { HanjiClient } from 'hanji-ts-sdk';

// wallet = new ethers.Wallet(<yourPrivateKey>, <provider>);

const client = new HanjiClient({
  apiBaseUrl: 'https://api-dev.hanji.io',
  webSocketApiBaseUrl: 'wss://api-dev.hanji.io',
  signerOrProvider: wallet,
});

const market = '<orderbookAddress>';
let tx: ContractTransactionResponse;

// Approve tokens for the future order
tx = await hanjiClient.spot.approveTokens({
  market,
  amount: new BigNumber(45.123),
  isBaseToken: true
});
console.log(tx.hash);

// Create a new order
tx = await hanjiClient.spot.placeOrder({
  market,
  type: 'limit',
  side: 'ask',
  size: new BigNumber(45.123),
  price: new BigNumber(1.17),
  maxCommission: new bigNumber(0.1),
  quantityToSend: 0n
});
console.log(tx.hash);

// Get user orders
const orders = await hanjiClient.spot.getOrders({ market, user: wallet.address });
console.log(orders);

// Find the new order
const newOrder = orders.find(o => o.txnHash === tx.hash);
console.log(newOrder);
```

### Post a new order (view with WebSockets)

```ts
import { ethers, type ContractTransactionResponse } from 'ethers';
import { HanjiClient } from 'hanji-ts-sdk';

// wallet = new ethers.Wallet(<yourPrivateKey>, <provider>);

const client = new HanjiClient({
  apiBaseUrl: 'https://api-dev.hanji.io',
  webSocketApiBaseUrl: 'wss://api-dev.hanji.io',
  signerOrProvider: wallet,
});

const market = '<orderbookAddress>';
let tx: ContractTransactionResponse | undefined;

// Subscribe to orders
hanjiClient.spot.events.ordersUpdated.addListener((orders) => {
  if (!tx)
    return;

  const newOrder = orders.find(o => o.txnHash === tx.hash);
  if (newOrder)
    console.log(newOrder);
})
hanjiClient.spot.subscribeToOrders({ market });

// Approve tokens for the future order
tx = await hanjiClient.spot.approveTokens({
  market,
  amount: new BigNumber(45.123),
  isBaseToken: true
});
console.log(tx.hash);

// Create a new order
tx = await hanjiClient.spot.createOrder({
  market,
  type: 'limit',
  side: 'ask',
  size: new BigNumber(45.123),
  price: new BigNumber(1.17)
  maxCommission: new bigNumber(0.1),
  quantityToSend: 0n
});
console.log(tx.hash);
```

### getOrderbook

Returns snapshot of the orderbook.

```ts
const orderbook = await hanjiClient.spot.getOrderbook({
  market: '<orderbookAddress>', // The address of the orderbook
  aggregation: 4, // Number of rounding decimals [optional]
  limit: 10, // Levels for each side [20 by default]
});
```

### getOrders

Returns user's orders.

```ts
const orders = await hanjiClient.spot.getOrders({
  market: '<orderbookAddress>', // The address of the orderbook
  user: '<userAddress>', // The address of the user
  limit: 10, // Number of orders to retrieve [100 by default]
  status: 'open', // Order statuses to filter by
});
```

### getTrades

Returns last trades.

```ts
const trades = await hanjiClient.spot.getTrades({
  market: '<orderbookAddress>', // The address of the orderbook
  limit: 10, // Number of trades to retrieve [100 by default]
});
```

### getFills

Returns user's fills.

```ts
const fills = await hanjiClient.spot.getFills({
  market: '<orderbookAddress>', // The address of the orderbook
  user: '<userAddress>', // The address of the user
  limit: 10, // Number of fills to retrieve [100 by default]
});
```

### getMarkets

Returns market data.

```ts
const markets = await hanjiClient.spot.getMarkets({
  market: '<orderbookAddress>', // The address of the orderbook
});
// If the market is not provided, data for all markets will be returned.
const allMarkets = await hanjiClient.spot.getMarkets({
});
```
