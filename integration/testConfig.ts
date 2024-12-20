import BigNumber from 'bignumber.js';
import type { Market } from '../src';

const testMarkets = {
  btcUsd: {
    id: '0x46FbD14B11891100f25A7b543bDFe68fF95A277f'.toLowerCase(),
    name: 'BTCUSDC',
    symbol: 'BTCUSDC',
    baseToken: {
      id: '0x92d81a25F6f46CD52B8230ef6ceA5747Bc3826Db'.toLowerCase(),
      name: 'Bitcoin',
      symbol: 'BTC',
      contractAddress: '0x92d81a25F6f46CD52B8230ef6ceA5747Bc3826Db'.toLowerCase(),
      decimals: 8,
      roundingDecimals: 8,
      supportsPermit: false,
      iconUrl: null,
      fromOg: false,
    },
    quoteToken: {
      id: '0x9626cC8790c547779551B5948029a4f646853F91'.toLowerCase(),
      name: 'USD Coin',
      symbol: 'USDC',
      contractAddress: '0x9626cC8790c547779551B5948029a4f646853F91'.toLowerCase(),
      decimals: 6,
      roundingDecimals: 2,
      supportsPermit: false,
      iconUrl: null,
      fromOg: false,
    },
    orderbookAddress: '0xe1e3de8da1f94f41d89b10783636d40cf58dafa2'.toLowerCase(),
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
    tokenXScalingFactor: 6,
    tokenYScalingFactor: 6,
    priceScalingFactor: 0,
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
    supportsNativeToken: false,
    isNativeTokenX: false,
    aggressiveFee: 0.0003,
    passiveFee: 0,
    passiveOrderPayout: 0.00005,
  },
  xtzUsd: {
    id: '0xA86F0AD9b353BF0De47DC6F367fdEc669D92F6fB'.toLowerCase(),
    name: 'XTZUSDC',
    symbol: 'XTZUSDC',
    baseToken: {
      id: 'xtz',
      name: 'XTZ',
      symbol: 'XTZ',
      contractAddress: '0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8'.toLowerCase(),
      decimals: 18,
      roundingDecimals: 6,
      supportsPermit: false,
      iconUrl: null,
      fromOg: false,
    },
    quoteToken: {
      id: '0x9626cc8790c547779551b5948029a4f646853f91',
      name: 'USD Coin',
      symbol: 'USDC',
      contractAddress: '0x9626cC8790c547779551B5948029a4f646853F91'.toLowerCase(),
      decimals: 6,
      roundingDecimals: 6,
      supportsPermit: false,
      iconUrl: null,
      fromOg: false,
    },
    orderbookAddress: '0xA86F0AD9b353BF0De47DC6F367fdEc669D92F6fB'.toLowerCase(),
    aggregations: expect.any(Array),
    rawLastPrice: expect.any(BigInt),
    lastPrice: expect.any(BigNumber),
    rawLowPrice24h: expect.any(BigInt),
    lowPrice24h: expect.any(BigNumber),
    rawHighPrice24h: expect.any(BigInt),
    highPrice24h: expect.any(BigNumber),
    tokenXScalingFactor: 2,
    tokenYScalingFactor: 6,
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
    supportsNativeToken: true,
    isNativeTokenX: true,
    aggressiveFee: 0.0003,
    passiveFee: 0,
    passiveOrderPayout: 0.00005,
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
