import type { Direction, OrderStatus, OrderType, Side } from '../../models';

export interface OrderBookLevelUpdateDto {
  price: string;
  size: string;
}

export interface OrderbookUpdateDto {
  timestamp: number;
  aggregation: string;
  levels: {
    asks: OrderBookLevelUpdateDto[];
    bids: OrderBookLevelUpdateDto[];
  };
}

export interface OrderUpdateDto {
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

export interface FillUpdateDto {
  tradeId: string;
  orderId: string;
  timestamp: number;
  owner: string;
  dir: Direction;
  type: OrderType;
  side: Side;
  txnHash: string;
  price: string;
  size: string;
}

export interface CandleUpdateDto {
  resolution: string;
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface TradeUpdateDto {
  tradeId: string;
  direction: Direction;
  price: string;
  size: string;
  timestamp: number;
  txnHash: string;
}

export interface MarketUpdateDto {
  id: string;
  name: string;
  symbol: string;
  orderbookAddress: string;
  aggregations: number[];
  lastPrice: string | null;
  lowPrice24h: string | null;
  highPrice24h: string | null;
  baseToken: TokenUpdateDto;
  quoteToken: TokenUpdateDto;
}

export interface TokenUpdateDto {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  scalingFactor: number;
  decimals: number;
  roundingDecimals: number;
}
