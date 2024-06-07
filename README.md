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
  singerOrProvider: wallet,
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
  singerOrProvider: wallet,
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
