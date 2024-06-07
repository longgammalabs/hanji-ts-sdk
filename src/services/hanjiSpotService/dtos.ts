import type { Direction, OrderStatus, OrderType, Side } from '../../models';

export interface OrderbookLevelDto {
  price: string;
  size: string;
}

export interface OrderbookDto {
  timestamp: number;
  levels: {
    asks: OrderbookLevelDto[];
    bids: OrderbookLevelDto[];
  };
}

export interface OrderDto {
  orderId: string;
  market: {
    id: string;
  };
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

export interface TradeDto {
  tradeId: string;
  direction: Direction;
  price: string;
  size: string;
  timestamp: number;
  txnHash: string;
}

export interface FillDto {
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
  price: string;
  size: string;
}

export interface TokenDto {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  scalingFactor: number;
  decimals: number;
  roundingDecimals: number;
}

export interface MarketDto {
  id: string;
  name: string;
  symbol: string;
  baseToken: TokenDto;
  quoteToken: TokenDto;
  orderbookAddress: string;
  aggregations: number[];
  lastPrice: string | null;
  lowPrice24h: string | null;
  highPrice24h: string | null;
}
