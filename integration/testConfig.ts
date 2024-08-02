import BigNumber from 'bignumber.js';
import type { Market } from '../src';

const testMarkets = {
  btcUsd: {
    id: '0x75B85038636BD5CaF46Cab0eC25703ccC04D185f'.toLowerCase(),
    name: 'BTCeUSD',
    symbol: 'BTCeUSD',
    baseToken: {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      contractAddress: '0x657f977f939f85E0991297F59bff7e8B610D0287'.toLowerCase(),
      decimals: 18,
      roundingDecimals: 4,
      supportsPermit: false,
    },
    quoteToken: {
      id: 'eUSD',
      name: 'eUSD',
      symbol: 'eUSD',
      contractAddress: '0xFAff0CBEFC07b2380eB8FA77D0ce2CB401aadb01'.toLowerCase(),
      decimals: 18,
      roundingDecimals: 2,
      supportsPermit: true,
    },
    orderbookAddress: '0x75B85038636BD5CaF46Cab0eC25703ccC04D185f'.toLowerCase(),
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
    tokenXScalingFactor: 3,
    tokenYScalingFactor: 4,
    priceScalingFactor: 1,
    rawPrice24h: expect.any(BigInt),
    price24h: expect.any(BigNumber),
    rawBestAsk: expect.any(BigInt),
    bestAsk: expect.any(BigNumber),
    rawBestBid: expect.any(BigInt),
    bestBid: expect.any(BigNumber),
    rawTradingVolume24h: expect.any(BigInt),
    tradingVolume24h: expect.any(BigNumber),
    totalSupply: expect.any(BigNumber),
    lastTouched: expect.any(BigInt),
  },
  xtzUsd: {
    id: '0xfd3d8A89994DD00f11c91340212B2b4b31f8B1B6'.toLowerCase(),
    name: 'XTZeUSD',
    symbol: 'XTZeUSD',
    baseToken: {
      id: 'XTZ',
      name: 'XTZ',
      symbol: 'XTZ',
      contractAddress: '0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8'.toLowerCase(),
      decimals: 18,
      roundingDecimals: 2,
      supportsPermit: false,
    },
    quoteToken: {
      id: 'eUSD',
      name: 'eUSD',
      symbol: 'eUSD',
      contractAddress: '0xFAff0CBEFC07b2380eB8FA77D0ce2CB401aadb01'.toLowerCase(),
      decimals: 18,
      roundingDecimals: 2,
      supportsPermit: true,
    },
    orderbookAddress: '0xfd3d8A89994DD00f11c91340212B2b4b31f8B1B6'.toLowerCase(),
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
    tokenXScalingFactor: 3,
    tokenYScalingFactor: 7,
    priceScalingFactor: 4,
    rawPrice24h: expect.any(BigInt),
    price24h: expect.any(BigNumber),
    rawBestAsk: expect.any(BigInt),
    bestAsk: expect.any(BigNumber),
    rawBestBid: expect.any(BigInt),
    bestBid: expect.any(BigNumber),
    rawTradingVolume24h: expect.any(BigInt),
    tradingVolume24h: expect.any(BigNumber),
    totalSupply: expect.any(BigNumber),
    lastTouched: expect.any(Number),
  },
} as const satisfies Record<string, Market>;

export interface TestConfig {
  readonly rpcUrl: string;
  readonly chainId: number;
  readonly accountPrivateKey: string;
  readonly hanjiApiBaseUrl: string;
  readonly hanjiWebsocketBaseUrl: string;
  readonly testMarkets: typeof testMarkets;
}

const envInfos = [
  ['RPC_URL', 'the RPC URL for EVM node'],
  ['CHAIN_ID', 'chain ID of the EVM network'],
  ['ACCOUNT_PRIVATE_KEY', 'the private key of the test account'],
  ['HANJI_API_BASE_URL', 'the base URL for Hanji API'],
  ['HANJI_WEBSOCKET_BASE_URL', 'the base URL for Hanji Websocket'],
] as const;

const validateRequiredEnvironmentVariables = (): [true, typeof process.env & Record<typeof envInfos[number][0], string>] | [false, string[]] => {
  const errors: string[] = [];
  for (const [name, description] of envInfos) {
    if (!process.env[name])
      errors.push(`Please, specify \x1b[34m${name}\x1b[0m - ${description}`);
  }

  return errors.length ? [false, errors] : [true, process.env as any];
};

const createInvalidEnvironmentVariablesError = (errors: string[]): Error =>
  new Error(errors.reduce(
    (acc, error, index) => `  ${acc}${index + 1}. ${error}\n`,
    '\nSome required environment variables are invalid:\n'
  ));

export const getTestConfig = (): TestConfig => {
  const [isValid, env] = validateRequiredEnvironmentVariables();
  if (!isValid)
    throw createInvalidEnvironmentVariablesError(env);

  return {
    rpcUrl: env.RPC_URL,
    chainId: Number.parseInt(env.CHAIN_ID),
    accountPrivateKey: env.ACCOUNT_PRIVATE_KEY,
    hanjiApiBaseUrl: env.HANJI_API_BASE_URL,
    hanjiWebsocketBaseUrl: env.HANJI_WEBSOCKET_BASE_URL,
    testMarkets,
  };
};
