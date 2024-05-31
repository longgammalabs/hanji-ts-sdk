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
