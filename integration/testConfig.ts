import BigNumber from 'bignumber.js';
import type { Market } from '../src';

const testMarkets = {
  btcUsd: {
    id: '0x4751a294e98b4f612957509a5a7be5cc03cb8be8',
    name: 'BTCeUSD',
    symbol: 'BTCeUSD',
    baseToken: {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      contractAddress: '0x657f977f939f85e0991297f59bff7e8b610d0287',
      scalingFactor: 3,
      decimals: 18,
      roundingDecimals: 4,
    },
    quoteToken: {
      id: 'eUSD',
      name: 'eUSD',
      symbol: 'eUSD',
      contractAddress: '0x1a71f491fb0ef77f13f8f6d2a927dd4c969ece4f',
      scalingFactor: 5,
      decimals: 18,
      roundingDecimals: 2,
    },
    orderbookAddress: '0x4751a294e98b4f612957509a5a7be5cc03cb8be8',
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
  },
  xtzUsd: {
    id: '0xce8a69B73034588BA81fB89A3533C6aB9934F117'.toLowerCase(),
    name: 'XTZeUSD',
    symbol: 'XTZeUSD',
    baseToken: {
      id: 'XTZ',
      name: 'XTZ',
      symbol: 'XTZ',
      contractAddress: '0xb1ea698633d57705e93b0e40c1077d46cd6a51d8'.toLowerCase(),
      scalingFactor: 3,
      decimals: 18,
      roundingDecimals: 2,
    },
    quoteToken: {
      id: 'eUSD',
      name: 'eUSD',
      symbol: 'eUSD',
      contractAddress: '0x1a71f491fb0ef77f13f8f6d2a927dd4c969ece4f',
      scalingFactor: 7,
      decimals: 18,
      roundingDecimals: 2,
    },
    orderbookAddress: '0xce8a69B73034588BA81fB89A3533C6aB9934F117',
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
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
