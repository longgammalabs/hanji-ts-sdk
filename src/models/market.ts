import type { Token } from './token';

export interface Market {
  id: string;
  name: string;
  symbol: string;
  baseToken: Token;
  quoteToken: Token;
  orderbookAddress: string;
  aggregations: number[];
  lastPrice: string;
  lowPrice24h: string;
  highPrice24h: string;
}
