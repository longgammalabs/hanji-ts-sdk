import BigNumber from 'bignumber.js';

import type { Token } from './common';

export type Side = 'ask' | 'bid';

export type Direction = 'buy' | 'sell';

export type OrderType = 'limit' | 'limit_post_only' | 'market';

export type OrderStatus = 'open' | 'filled' | 'claimed' | 'cancelled';

export interface Market {
  id: string;
  name: string;
  symbol: string;
  baseToken: Token;
  quoteToken: Token;
  orderbookAddress: string;
  aggregations: number[];
  rawLastPrice: bigint | null;
  lastPrice: BigNumber | null;
  rawLowPrice24h: bigint | null;
  lowPrice24h: BigNumber | null;
  rawHighPrice24h: bigint | null;
  highPrice24h: BigNumber | null;
}

export type MarketUpdate = Market;

export interface OrderbookLevel {
  rawPrice: bigint;
  price: BigNumber;
  rawSize: bigint;
  size: BigNumber;
}

export interface Orderbook {
  timestamp: number;
  levels: {
    asks: OrderbookLevel[];
    bids: OrderbookLevel[];
  };
}

export type OrderbookUpdate = Orderbook;

export interface Order {
  orderId: string;
  market: {
    id: string;
  };
  type: OrderType;
  owner: string;
  side: Side;
  rawPrice: bigint;
  price: BigNumber;
  rawSize: bigint;
  size: BigNumber;
  rawOrigSize: bigint;
  origSize: BigNumber;
  rawClaimed: bigint;
  claimed: BigNumber;
  createdAt: number;
  lastTouched: number;
  txnHash: string;
  status: OrderStatus;
}

export type OrderUpdate = Order;

export interface Trade {
  tradeId: string;
  direction: Direction;
  rawPrice: bigint;
  price: BigNumber;
  rawSize: bigint;
  size: BigNumber;
  timestamp: number;
  txnHash: string;
}

export type TradeUpdate = Trade;

export interface Fill {
  orderId: string;
  tradeId: string;
  market: {
    id: string;
  };
  timestamp: number;
  owner: string;
  dir: Direction;
  type: OrderType;
  side: Side;
  txnHash: string;
  rawPrice: bigint;
  price: BigNumber;
  rawSize: bigint;
  size: BigNumber;
}

export type FillUpdate = Fill;

export interface MarketInfo {
  id: string;
  name: string;
  symbol: string;
  baseToken: Token;
  quoteToken: Token;
  orderbookAddress: string;
  scalingFactors: {
    baseToken: number;
    quoteToken: number;
    price: number;
  };
}
