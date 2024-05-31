import type { OrderStatus } from './orderStatus';
import type { OrderType } from './orderType';
import type { Side } from './side';

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
