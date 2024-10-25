import BigNumber from 'bignumber.js';
import { ethers, Signer } from 'ethers';
import { Orderbook } from './models';

export const testMarket = {
  id: '0x3f295daf44fb09bcdf61d7727b8a202e3393f9be'.toLowerCase(),
  name: 'XTZUSDC',
  symbol: 'XTZUSDC',
  baseToken: {
    id: 'XTZ',
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
    id: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    contractAddress: '0xa7c9092A5D2C3663B7C5F714dbA806d02d62B58a'.toLowerCase(),
    decimals: 18,
    roundingDecimals: 6,
    supportsPermit: false,
    iconUrl: null,
    fromOg: false,
  },
  orderbookAddress: '0x3f295daf44fb09bcdf61d7727b8a202e3393f9be'.toLowerCase(),
  aggregations: expect.any(Array),
  rawLastPrice: expect.any(BigInt),
  lastPrice: expect.any(BigNumber),
  rawLowPrice24h: expect.any(BigInt),
  lowPrice24h: expect.any(BigNumber),
  rawHighPrice24h: expect.any(BigInt),
  highPrice24h: expect.any(BigNumber),
  tokenXScalingFactor: 5,
  tokenYScalingFactor: 9,
  priceScalingFactor: 4,
  rawPrice24h: expect.any(BigInt),
  price24h: expect.any(BigNumber),
  rawBestAsk: 6976n,
  bestAsk: new BigNumber(0.6976),
  rawBestBid: 6958n,
  bestBid: new BigNumber(0.6958),
  rawTradingVolume24h: expect.any(BigInt),
  tradingVolume24h: expect.any(BigNumber),
  totalSupply: expect.any(BigNumber),
  lastTouched: expect.any(Number),
  supportsNativeToken: true,
  isNativeTokenX: true,
  aggressiveFee: 0.0003,
  passiveFee: 0,
  passiveOrderPayout: 0.00005,
};

export const testOrderbook: Orderbook['levels'] = {
  asks: [
    { rawPrice: 6993n, price: new BigNumber(0.6993), rawSize: 10000000n, size: new BigNumber(100) },
    { rawPrice: 6988n, price: new BigNumber(0.6988), rawSize: 10000000n, size: new BigNumber(100) },
    { rawPrice: 6976n, price: new BigNumber(0.6976), rawSize: 10000000n, size: new BigNumber(100) },
  ],
  bids: [
    { rawPrice: 6958n, price: new BigNumber(0.6958), rawSize: 10000000n, size: new BigNumber(100) },
    { rawPrice: 6948n, price: new BigNumber(0.6948), rawSize: 10000000n, size: new BigNumber(100) },
    { rawPrice: 6938n, price: new BigNumber(0.6938), rawSize: 10000000n, size: new BigNumber(100) },
  ],
};

const provider = new ethers.JsonRpcProvider('https://node.ghostnet.etherlink.com');
export const testAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // from hardhat-ethers
export const testPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(testPrivateKey, provider);

export const testSigner: Signer = wallet;
