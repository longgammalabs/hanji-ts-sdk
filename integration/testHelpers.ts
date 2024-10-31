import BigNumber from 'bignumber.js';
import type { Order } from '../src';
import { wait } from '../src/utils/delay';

export const addressRegex = /^0x[0-9a-fA-F]{40}$/;
export const transactionRegex = /^0x[0-9a-f]{64}$/;

const orderTypes = ['limit', 'market'] as const satisfies Order['type'][];
const orderSides = ['ask', 'bid'] as const satisfies Order['side'][];
const orderStatus = ['open', 'filled', 'claimed', 'cancelled'] as const satisfies Order['status'][];

export const expectOrder = (order: Order | undefined | null, values?: Partial<Order>) => {
  expect(order).toBeDefined();
  expect(orderTypes).toContain(order!.type);
  expect(orderSides).toContain(order!.side);
  expect(orderStatus).toContain(order!.status);

  expect(order).toMatchObject<Order>({
    orderId: expect.any(String),
    market: {
      id: expect.stringMatching(addressRegex),
    },
    type: expect.any(String),
    owner: expect.stringMatching(addressRegex),
    side: expect.any(String),
    rawPrice: expect.any(BigInt),
    price: expect.any(BigNumber),
    rawSize: expect.any(BigInt),
    size: expect.any(BigNumber),
    rawOrigSize: expect.any(BigInt),
    origSize: expect.any(BigNumber),
    rawClaimed: expect.any(BigInt),
    claimed: expect.any(BigNumber),
    createdAt: expect.any(Number),
    lastTouched: expect.any(Number),
    txnHash: expect.stringMatching(transactionRegex),
    status: expect.any(String),
    isPostOnly: expect.any(Boolean),
    logIndex: expect.any(Number),
    ...values,
  });
};

export const waitForOrder = async (
  ordersGetter: () => Promise<readonly Order[]>,
  predicate: (value: Order, index: number, obj: readonly Order[]) => boolean
): Promise<Order | undefined> => {
  for (let i = 0; i < 3; i++) {
    const orders = await ordersGetter();
    const order = orders.find(predicate);
    if (order)
      return order;

    await wait(1000);
  }
};

export const waitAtLeastNOrders = async (
  ordersGetter: () => Promise<readonly Order[]>,
  predicate: (value: Order, index: number, obj: readonly Order[]) => boolean,
  expectedOrderCount: number
): Promise<Order[] | undefined> => {
  let foundOrders: Order[] = [];
  for (let i = 0; i < 3; i++) {
    const orders = await ordersGetter();
    const ordersFiltered = orders.filter(predicate);
    foundOrders = foundOrders.concat(ordersFiltered);

    if (foundOrders.length >= expectedOrderCount)
      return foundOrders;

    await wait(1000);
  }
};
