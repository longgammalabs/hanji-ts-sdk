import type { Direction, OrderStatus, OrderType, Side } from '../../models';

export interface OrderBookLevelUpdateDto {
  price: string;
  size: string;
  lastTouched: number;
}

export interface OrderbookUpdateDto {
  timestamp: number;
  aggregation: number;
  levels: {
    asks: OrderBookLevelUpdateDto[];
    bids: OrderBookLevelUpdateDto[];
  };
}

export interface OrderUpdateDto {
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
  isPostOnly: boolean;
  logIndex: number;
}

export interface OrderHistoryUpdateDto {
  market: {
    id: string;
  };
  timestamp: number;
  owner: string;
  type: OrderType;
  side: Side;
  txnHash: string;
  orderId: string;
  price: string;
  size: string;
  origSize: string;
  status: OrderStatus;
  claimed: string;
  fee: string;
  isPostOnly: boolean;
}

export interface FillUpdateDto {
  tradeId: string;
  market: {
    id: string;
  };
  orderId: string;
  timestamp: number;
  owner: string;
  dir: Direction;
  type: OrderType;
  side: Side;
  txnHash: string;
  price: string;
  size: string;
  fee: string;
}

export interface CandleUpdateDto {
  market: {
    id: string;
  };
  resolution: string;
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  lastTouched: number;
}

export interface TradeUpdateDto {
  market: {
    id: string;
  };
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
  tokenXScalingFactor: number;
  tokenYScalingFactor: number;
  priceScalingFactor: number;
  bestAsk: string | null;
  bestBid: string | null;
  tradingVolume24h: string;
  lastPrice: string | null;
  lowPrice24h: string | null;
  highPrice24h: string | null;
  price24h: string | null;
  coinMarketCapId: string;
  totalSupply: string;
  lastTouched: number;
  baseToken: TokenUpdateDto;
  quoteToken: TokenUpdateDto;
  supportsNativeToken: boolean;
  isNativeTokenX: boolean;
  aggressiveFee: string;
  passiveFee: string;
  passiveOrderPayout: string;
}

export interface TokenUpdateDto {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
  roundingDecimals: number;
  supportsPermit: boolean;
  iconUrl: string | null;
  fromOg: boolean;
}
