# Hanji TypeScript SDK

The Hanji TypeScript SDK is a library that simplifies the interaction with the Hanji API, allowing developers to easily access and manipulate data related to the Hanji platform.

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org) version 20.10.0 or later  
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [Yarn](https://yarnpkg.com/)

### Installation

1. Install the SDK package

    ```sh
    npm install hanji-ts-sdk
    ```

2. Install the [ws](https://github.com/websockets/ws) package if you going to use it in the Node.js environment

    ```sh
    npm install ws
    ```

### Spot

#### Post a new order (API)

```ts
import { ethers, type ContractTransactionResponse } from 'ethers';
import { HanjiClient } from 'hanji-ts-sdk';

// wallet = new ethers.Wallet(<yourPrivateKey>, <provider>);

const client = new HanjiClient({
  apiBaseUrl: 'https://api.hanji.io',
  webSocketApiBaseUrl: 'wss://api.hanji.io',
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
tx = await hanjiClient.spot.createOrder({
  market,
  type: 'limit',
  side: 'ask',
  size: new BigNumber(45.123),
  price: new BigNumber(1.17)
});
console.log(tx.hash);

// Get user orders
const orders = await hanjiClient.spot.getOrders({ market, user: wallet.address });
console.log(orders);

// Find the new order
const newOrder = orders.find(o => o.txnHash === tx.hash);
console.log(newOrder);
```


#### Post a new order (WebSockets)

```ts
import { ethers, type ContractTransactionResponse } from 'ethers';
import { HanjiClient } from 'hanji-ts-sdk';

// wallet = new ethers.Wallet(<yourPrivateKey>, <provider>);

const client = new HanjiClient({
  apiBaseUrl: 'https://api.hanji.io',
  webSocketApiBaseUrl: 'wss://api.hanji.io',
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
});
console.log(tx.hash);
```

## API

### Spot 

#### getOrderbook

Returns snapshot of the orderbook.

```ts
const orderbook = await hanjiClient.spot.getOrderbook({
  market: '<orderbookAddress>', // The address of the orderbook
  aggregation: 4, // Number of rounding decimals [optional]
  limit: 10, // Levels for each side [20 by default]
});
```

#### getOrders

Returns user's orders.

```ts
const orders = await hanjiClient.spot.getOrders({
  market: '<orderbookAddress>', // The address of the orderbook
  user: '<userAddress>', // The address of the user
  limit: 10, // Number of orders to retrieve [100 by default]
  status: 'open', // Order statuses to filter by
});
```

#### getTrades

Returns last trades.

```ts
const trades = await hanjiClient.spot.getTrades({
  market: '<orderbookAddress>', // The address of the orderbook
  limit: 10, // Number of trades to retrieve [100 by default]
});
```

#### getFills

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

## Contributing

First, install all necessary dependencies:

```sh
npm ci
```

### Building

To build the project, run the following command:

```sh
npm run build
```

This command will generate all necessary files to publish.

Also, you can use the `npm run watch` command to watch for changes and build automatically.

```sh
npm run watch
```

### Testing

Currently, the SDK has only integration tests.
To run them, use the following command:

```sh
npm run test:integration
```

If you need to run the specific test, use the jest command. Don't forget to pass the Jest CLI options:

```sh
npm run jest -- <options>
```
