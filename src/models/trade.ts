import type { Direction } from './direction';

export interface Trade {
  tradeId: string;
  direction: Direction;
  price: string;
  size: string;
  timestamp: number;
  txnHash: string;
}

export type TradeUpdate = Trade;
