import BigNumber from 'bignumber.js';

import type { Token } from './common';

/**
 * Represents the side of an order in the market.
 * 'ask' indicates a sell order, and 'bid' indicates a buy order.
 */
export type Side = 'ask' | 'bid';

/**
 * Represents the direction of an order in the market.
 * 'buy' indicates a purchase order, and 'sell' indicates a sell order.
 */
export type Direction = 'buy' | 'sell';

/**
 * Represents the type of an order in the market.
 * 'limit' indicates a limit order, 'limit_post_only' indicates a limit order that can only be executed after it is posted to the orderbook, and 'market' indicates a market order.
 */
export type OrderType = 'limit' | 'limit_post_only' | 'market';

/**
 * Represents the status of an order in the market.
 * 'open' indicates an order that is still active,
 * 'filled' indicates an order that has been filled by trades,
 * 'claimed' indicates an order that has been claimed by a user, and
 * 'cancelled' indicates an order that has been cancelled.
 */
export type OrderStatus = 'open' | 'filled' | 'claimed' | 'cancelled';

/**
 * Represents the resolution of a candle in the market.
 * '1' indicates a 1-minute resolution,
 * '5' indicates a 5-minute resolution,
 * '15' indicates a 15-minute resolution,
 * '60' indicates a 1-hour resolution,
 * '240' indicates a 4-hour resolution,
 * '1D' indicates a 1-day resolution.
 */
export type CandleResolution = '1' | '5' | '15' | '60' | '240' | '1D';

/**
 * Represents a market in the trading system.
 */
export interface Market {
  /**
   * Unique identifier for the market.
   */
  id: string;

  /**
   * Name of the market.
   */
  name: string;

  /**
   * Symbol representing the market.
   */
  symbol: string;

  /**
   * The base token of the market.
   */
  baseToken: Token;

  /**
   * The quote token of the market.
   */
  quoteToken: Token;

  /**
   * Address of the orderbook associated with the market.
   */
  orderbookAddress: string;

  /**
   * Array of aggregation levels for the market.
   */
  aggregations: number[];

  /**
   * Scaling factor for the base token (token X) in the market.
   * This factor is used to adjust the base token's value for market operations.
   */
  tokenXScalingFactor: number;

  /**
   * Scaling factor for the quote token (token Y) in the market.
   * This factor is used to adjust the quote token's value for market operations.
   */
  tokenYScalingFactor: number;

  /**
   * Scaling factor for the price in the market.
   * This factor is used to adjust the price value for market operations.
   */
  priceScalingFactor: number;

  /**
   * The raw last price of the market as a bigint, or null if not available.
   */
  rawLastPrice: bigint | null;

  /**
   * The last price of the market as a BigNumber, or null if not available.
   */
  lastPrice: BigNumber | null;

  /**
   * The raw lowest price in the last 24 hours as a bigint, or null if not available.
   */
  rawLowPrice24h: bigint | null;

  /**
   * The lowest price in the last 24 hours as a BigNumber, or null if not available.
   */
  lowPrice24h: BigNumber | null;

  /**
   * The raw highest price in the last 24 hours as a bigint, or null if not available.
   */
  rawHighPrice24h: bigint | null;

  /**
   * The highest price in the last 24 hours as a BigNumber, or null if not available.
   */
  highPrice24h: BigNumber | null;

  /**
   * The raw price one day ago as a bigint, or null if not available.
   */
  rawPrice24h: bigint | null;

  /**
   * The price one day ago as a BigNumber, or null if not available.
   */
  price24h: BigNumber | null;

  /**
   * The raw best ask price as a bigint, or null if not available.
   */
  rawBestAsk: bigint | null;

  /**
   * The best ask price as a BigNumber, or null if not available.
   */
  bestAsk: BigNumber | null;

  /**
   * The raw best bid price as a bigint, or null if not available.
   */
  rawBestBid: bigint | null;

  /**
   * The best bid price as a BigNumber, or null if not available.
   */
  bestBid: BigNumber | null;

  /**
   * The raw trading volume in the last 24 hours as a bigint, or null if not available.
   */
  rawTradingVolume24h: bigint | null;

  /**
   * The trading volume in the last 24 hours as a BigNumber, or null if not available.
   */
  tradingVolume24h: BigNumber | null;

  /**
   * The total supply of the market as a BigNumber, or null if not available.
   */
  totalSupply: BigNumber | null;

  /**
   * The timestamp of the last update as a number.
   */
  lastTouched: number;

  /**
   * Indicates whether the market supports using a native token.
   */
  supportsNativeToken: boolean;

  /**
   * Indicates whether the native token is token X (base token).
   */
  isNativeTokenX: boolean;

  /**
   * Fee for placing aggressive orders.
   */
  aggressiveFee: number;

  /**
   * Fee for placing passive orders.
   */
  passiveFee: number;

  /**
   * Payout for placing passive orders.
   */
  passiveOrderPayout: number;
}

export type MarketUpdate = Market;

/**
 * Represents a level in the orderbook with both raw and formatted values.
 */
export interface OrderbookLevel {
  /**
   * The raw price of the orderbook level as a bigint.
   */
  rawPrice: bigint;

  /**
   * The formatted price of the orderbook level as a BigNumber.
   */
  price: BigNumber;

  /**
   * The raw size of the orderbook level as a bigint.
   */
  rawSize: bigint;

  /**
   * The formatted size of the orderbook level as a BigNumber.
   */
  size: BigNumber;
}

/**
 * Represents the orderbook of a market at a specific point in time.
 */
export interface Orderbook {
  /**
   * The timestamp of the orderbook snapshot.
   */
  timestamp: number;

  /**
   * The aggregation level of the orderbook, representing the granularity of the price levels.
   */
  aggregation: number;
  /**
   * The levels of the orderbook, containing both ask and bid levels.
   */
  levels: {
    /**
     * The list of ask levels in the orderbook.
     */
    asks: OrderbookLevel[];

    /**
     * The list of bid levels in the orderbook.
     */
    bids: OrderbookLevel[];
  };
}

export type OrderbookUpdate = Orderbook;

/**
 * Represents an order in the Hanji Spot market.
 */
export interface Order {
  /**
   * The unique identifier of the order.
   *
   * @type {string}
   */
  orderId: string;

  /**
   * The market information where the order is placed.
   */
  market: {
    /**
     * The unique identifier of the market.
     *
     * @type {string}
     */
    id: string;
  };

  /**
   * The type of the order (e.g., limit, market).
   *
   * @type {OrderType}
   */
  type: OrderType;

  /**
   * The owner of the order.
   *
   * @type {string}
   */
  owner: string;

  /**
   * The side of the order (buy or sell).
   *
   * @type {Side}
   */
  side: Side;

  /**
   * The raw price of the order as a bigint.
   *
   * @type {bigint}
   */
  rawPrice: bigint;

  /**
   * The formatted price of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  price: BigNumber;

  /**
   * The raw size of the order as a bigint.
   *
   * @type {bigint}
   */
  rawSize: bigint;

  /**
   * The formatted size of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  size: BigNumber;

  /**
   * The raw original size of the order as a bigint.
   *
   * @type {bigint}
   */
  rawOrigSize: bigint;

  /**
   * The formatted original size of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  origSize: BigNumber;

  /**
   * The raw claimed amount of the order as a bigint.
   *
   * @type {bigint}
   */
  rawClaimed: bigint;

  /**
   * The formatted claimed amount of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  claimed: BigNumber;

  /**
   * The timestamp when the order was created.
   *
   * @type {number}
   */
  createdAt: number;

  /**
   * The timestamp when the order was last touched.
   *
   * @type {number}
   */
  lastTouched: number;

  /**
   * The transaction hash associated with the order.
   *
   * @type {string}
   */
  txnHash: string;

  /**
   * The current status of the order.
   *
   * @type {OrderStatus}
   */
  status: OrderStatus;

  /**
   * Indicates if the order was placed with post-only flag.
   *
   * @type {boolean}
   */
  isPostOnly: boolean;
}

export type OrderUpdate = Order;

/**
 * Represents a trade in the market.
 *
 * @interface Trade
 */
export interface Trade {
  /**
   * The unique identifier of the trade.
   *
   * @type {string}
   */
  tradeId: string;

  /**
   * The market where the trade occurred.
   *
   * @type {Object}
   */
  market: {
    /**
     * The unique identifier of the market.
     *
     * @type {string}
     */
    id: string;
  };

  /**
   * The direction of the trade (buy or sell).
   *
   * @type {Direction}
   */
  direction: Direction;

  /**
   * The raw price of the trade as a bigint.
   *
   * @type {bigint}
   */
  rawPrice: bigint;

  /**
   * The formatted price of the trade as a BigNumber.
   *
   * @type {BigNumber}
   */
  price: BigNumber;

  /**
   * The raw size of the trade as a bigint.
   *
   * @type {bigint}
   */
  rawSize: bigint;

  /**
   * The formatted size of the trade as a BigNumber.
   *
   * @type {BigNumber}
   */
  size: BigNumber;

  /**
   * The timestamp when the trade occurred.
   *
   * @type {number}
   */
  timestamp: number;

  /**
   * The transaction hash associated with the trade.
   *
   * @type {string}
   */
  txnHash: string;
}

export type TradeUpdate = Trade;

/**
 * Represents a fill in the trading system.
 *
 * @interface Fill
 */
export interface Fill {
  /**
   * The unique identifier of the order associated with the fill.
   *
   * @type {string}
   */
  orderId: string;

  /**
   * The unique identifier of the trade associated with the fill.
   *
   * @type {string}
   */
  tradeId: string;

  /**
   * The market where the fill occurred.
   *
   * @type {Object}
   */
  market: {
    /**
     * The unique identifier of the market.
     *
     * @type {string}
     */
    id: string;
  };

  /**
   * The timestamp when the fill occurred.
   *
   * @type {number}
   */
  timestamp: number;

  /**
   * The owner of the order associated with the fill.
   *
   * @type {string}
   */
  owner: string;

  /**
   * The direction of the order (buy or sell).
   *
   * @type {Direction}
   */
  dir: Direction;

  /**
   * The type of the order (e.g., limit, market).
   *
   * @type {OrderType}
   */
  type: OrderType;

  /**
   * The side of the order (ask or bid).
   *
   * @type {Side}
   */
  side: Side;

  /**
   * The transaction hash associated with the fill.
   *
   * @type {string}
   */
  txnHash: string;

  /**
   * The raw price of the fill as a bigint.
   *
   * @type {bigint}
   */
  rawPrice: bigint;

  /**
   * The formatted price of the fill as a BigNumber.
   *
   * @type {BigNumber}
   */
  price: BigNumber;

  /**
   * The raw size of the fill as a bigint.
   *
   * @type {bigint}
   */
  rawSize: bigint;

  /**
   * The formatted size of the fill as a BigNumber.
   *
   * @type {BigNumber}
   */
  size: BigNumber;

  /**
   * The raw fee of the fill as a bigint.
   *
   * @type {bigint}
   */
  rawFee: bigint;

  /**
   * The formatted fee of the fill as a BigNumber.
   *
   * @type {BigNumber}
   */
  fee: BigNumber;
}

export type FillUpdate = Fill;

/**
 * Represents a candle in the trading system.
 *
 * @interface Candle
 */
export interface Candle {
  /**
   * The time of the candle.
   *
   * @type {number}
   */
  time: number;

  /**
   * The opening price of the candle.
   *
   * @type {string}
   */
  open: string;

  /**
   * The highest price of the candle.
   *
   * @type {string}
   */
  high: string;

  /**
   * The lowest price of the candle.
   *
   * @type {string}
   */
  low: string;

  /**
   * The closing price of the candle.
   *
   * @type {string}
   */
  close: string;

  /**
   * The volume of the candle.
   *
   * @type {string}
   */
  volume: string;

  /**
   * The last time the candle was updated.
   *
   * @type {number}
   */
  lastTouched: number;
}
export type CandleUpdate = Candle;

export interface MarketOrderDetails {
  buy: {
    fee: number;
    estFee: number;
    worstPrice: number;
    estPrice: number;
    estWorstPrice: number;
    estSlippage: number;
    autoSlippage: number;
    tokenXReceive: number;
    estTokenXReceive: number;
    tokenYPay: number;
    estTokenYPay: number;
  };
  sell: {
    fee: number;
    estFee: number;
    worstPrice: number;
    estPrice: number;
    estWorstPrice: number;
    estSlippage: number;
    autoSlippage: number;
    tokenXPay: number;
    estTokenXPay: number;
    tokenYReceive: number;
    estTokenYReceive: number;
  };
}

export interface LimitOrderDetails {
  buy: {
    maxFee: number;
    price: number;
    tokenXReceive: number;
    maxTokenYPay: number;
    minTokenYPay: number;
  };
  sell: {
    maxFee: number;
    price: number;
    tokenXPay: number;
    maxTokenYReceive: number;
    minTokenYReceive: number;
  };
}

/**
 * Represents the user balances for various tokens.
 */
export interface UserBalances {
  balances: {
    /**
     * The symbol of the token.
     *
     * @type {string}
     */
    token: string;

    /**
     * The address of the token.
     *
     * @type {string}
     */
    tokenAddress: string;

    /**
     * The amount of the token that is currently locked in orders.
     *
     * @type {number}
     */
    hold: number;

    /**
     * The total user amount of the token.
     *
     * @type {number}
     */
    total: number;

    /**
     * The user deposits amount of the tokenX.
     *
     * @type {number}
     */
    depositedTokenX: number;

    /**
     * The user deposits amount of the tokenY.
     *
     * @type {number}
     */
    depositedTokenY: number;
  }[];
}

/**
 * Represents an order history log in the Hanji Spot market.
 */
export interface OrderHistory {
  /**
   * The unique identifier of the order.
   *
   * @type {string}
   */
  orderId: string;

  /**
   * The market information where the order is placed.
   */
  market: {
    /**
     * The unique identifier of the market.
     *
     * @type {string}
     */
    id: string;
  };

  /**
   * The type of the order (e.g., limit, market).
   *
   * @type {OrderType}
   */
  type: OrderType;

  /**
   * The owner of the order.
   *
   * @type {string}
   */
  owner: string;

  /**
   * The side of the order (ask or bid).
   *
   * @type {Side}
   */
  side: Side;

  /**
   * The raw price of the order as a bigint.
   *
   * @type {bigint}
   */
  rawPrice: bigint;

  /**
   * The formatted price of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  price: BigNumber;

  /**
   * The raw size of the order as a bigint.
   *
   * @type {bigint}
   */
  rawSize: bigint;

  /**
   * The formatted size of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  size: BigNumber;

  /**
   * The raw original size of the order as a bigint.
   *
   * @type {bigint}
   */
  rawOrigSize: bigint;

  /**
   * The formatted original size of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  origSize: BigNumber;

  /**
   * The raw claimed amount of the order as a bigint.
   *
   * @type {bigint}
   */
  rawClaimed: bigint;

  /**
   * The formatted claimed amount of the order as a BigNumber.
   *
   * @type {BigNumber}
   */
  claimed: BigNumber;

  /**
   * The timestamp when the order history log was created.
   *
   * @type {number}
   */
  timestamp: number;

  /**
   * The transaction hash associated with the order history log.
   *
   * @type {string}
   */
  txnHash: string;

  /**
   * The status of the order associated with the order history log.
   *
   * @type {OrderStatus}
   */
  status: OrderStatus;

  /**
   * The raw fee for the order as a bigint associated with the order history log.
   *
   * @type {bigint}
   */
  rawFee: bigint;

  /**
   * The formatted fee for the order as a BigNumber associated with the order history log.
   *
   * @type {BigNumber}
   */
  fee: BigNumber;

  /**
   * Indicates if the order was placed with post-only flag.
   *
   * @type {boolean}
   */
  isPostOnly: boolean;
}

export type OrderHistoryUpdate = OrderHistory;
