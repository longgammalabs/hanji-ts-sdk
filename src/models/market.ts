import type { Token } from './token';

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
