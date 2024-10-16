# HanjiClient

## Overview

The `HanjiClient` class is a central component for interacting with the Hanji API. It manages the connection to the Hanji API and provides methods to interact with the Hanji Spot contracts.

## Constructor

### `constructor(options: Readonly<HanjiClientOptions>)`

Creates a new instance of the `HanjiClient`.

**Parameters:**

| Parameter                   | Type                          | Description                                                                 |
|-----------------------------|-------------------------------|-----------------------------------------------------------------------------|
| `apiBaseUrl`                | `string`                      | The base URL for the Hanji API.                                             |
| `webSocketApiBaseUrl`       | `string`                      | The base URL for the Hanji WebSocket API.                                   |
| `signer`                    | `Signer \| null`              | The ethers signer used for signing transactions.                            |
| `webSocketConnectImmediately?` | `boolean`                 | Whether to connect to the WebSocket immediately after creating the `HanjiClient` (default is true). |

## Properties

### `spot: HanjiSpot`

An instance of `HanjiSpot` that provides API functions to interact with the Hanji Spot contracts.

## Methods

### `setSigner(signer: Signer | null): void`

Sets or unsets the signer for the `HanjiClient`.

**Parameters:**

- `signer` (Signer): The signer to set.

## Example Usage

```typescript
import { HanjiClient, HanjiClientOptions } from 'hanji-ts-sdk';

const options: HanjiClientOptions = {
  apiBaseUrl: 'https://api.hanji.io',
  webSocketApiBaseUrl: 'wss://ws.hanji.io',
  signer: null,
  webSocketConnectImmediately: false,
};

const hanjiClient = new HanjiClient(options);

// If you need to use user-oriented methods, set a signer or provider:
// newSigner = new ethers.Wallet(<yourPrivateKey>, <provider>);
hanjiClient.setSigner(newSigner);
```
