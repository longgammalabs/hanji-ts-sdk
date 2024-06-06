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
  lastPrice: string | null;
  lowPrice24h: string | null;
  highPrice24h: string | null;
}

export type MarketUpdate = Market;

interface OrderbookLevel {
  price: string;
  size: string;
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
  type: OrderType;
  owner: string;
  side: Side;
  price: string;
  size: string;
  origSize: string;
  claimed: string;
  createdAt: number;
  lastTouched: number;
  txnHash: string;
  status: OrderStatus;
}

export type OrderUpdate = Order;

export interface Trade {
  tradeId: string;
  direction: Direction;
  price: string;
  size: string;
  timestamp: number;
  txnHash: string;
}

export type TradeUpdate = Trade;

export interface Fill {
  orderId: string;
  tradeId: string;
  timestamp: number;
  owner: string;
  dir: Direction;
  type: OrderType;
  side: Side;
  txnHash: string;
  price: string;
  size: string;
}

export type FillUpdate = Fill;
