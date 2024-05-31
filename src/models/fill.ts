import type { Direction } from './direction';
import type { OrderType } from './orderType';
import type { Side } from './side';

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
