import BigNumber from 'bignumber.js';

import { OrderType, type OrderStatus, type Side } from '../models';

export interface ApproveSpotParams {
  market: string;
  isBaseToken: boolean;
  amount: BigNumber | bigint;
}

export interface DepositSpotParams {
  market: string;
  baseTokenAmount: BigNumber | bigint;
  quoteTokenAmount: BigNumber | bigint;
}

interface WithdrawBaseSpotParams {
  market: string;
  baseTokenAmount?: BigNumber | bigint;
  quoteTokenAmount?: BigNumber | bigint;
  withdrawAll?: boolean;
}

interface WithdrawSpecificTokenAmountsSpotParams extends WithdrawBaseSpotParams {
  baseTokenAmount: BigNumber | bigint;
  quoteTokenAmount: BigNumber | bigint;
}

interface WithdrawAllSpotParams extends WithdrawBaseSpotParams {
  withdrawAll: true;
}

export type WithdrawSpotParams =
  | WithdrawSpecificTokenAmountsSpotParams
  | WithdrawAllSpotParams;

export interface SetClaimableStatusParams {
  market: string;
  status: boolean;
}

export interface PlaceOrderSpotParams {
  market: string;
  type: OrderType;
  side: Side;
  size: BigNumber | bigint;
  price: BigNumber | bigint;
  transferExecutedTokens?: boolean;
}

export type BatchPlaceOrderSpotParams = {
  market: string;
  type: 'limit' | 'limit_post_only';
  orderParams: Array<{
    side: Side;
    size: BigNumber | bigint;
    price: BigNumber | bigint;
  }>;
  transferExecutedTokens?: boolean;
};

export interface ClaimOrderSpotParams {
  market: string;
  orderId: string;
  transferExecutedTokens?: boolean;
}

export interface BatchClaimOrderSpotParams {
  market: string;
  claimParams: Array<{
    orderId: string;
    address: string;
  }>;
}

export interface ChangeOrderSpotParams {
  market: string;
  orderId: string;
  newSize: BigNumber | bigint;
  newPrice: BigNumber | bigint;
  type: 'limit' | 'limit_post_only';
  transferExecutedTokens?: boolean;
}

export interface BatchChangeOrderSpotParams {
  market: string;
  orderParams: Array<{
    orderId: string;
    newSize: BigNumber | bigint;
    newPrice: BigNumber | bigint;
  }>;
  type: 'limit' | 'limit_post_only';
  transferExecutedTokens?: boolean;
}

/**
 * Parameters for retrieving the order book.
 *
 * @interface GetOrderbookParams
 */
export interface GetOrderbookParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Number of rounding decimals
   *
   * @type {number}
   * @optional
   */
  aggregation?: number;
  /**
   * Levels for each side
   *
   * @type {number}
   * @optional
   * @default 20
   */
  limit?: number;
}

/**
 * Parameters for retrieving the orders.
 *
 * @interface GetOrdersParams
 */
export interface GetOrdersParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Address in 42-character hexadecimal format
   *
   * @type {string}
   */
  user: string;
  /**
   * Number of orders to retrieve
   *
   * @type {number}
   * @optional
   * @default 100
   */
  limit?: number;
  /**
   * Order statuses to filter by
   *
   * @type {OrderStatus | OrderStatus[]}
   * @optional
   */
  status?: OrderStatus | OrderStatus[];
}

export interface GetTradesParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Number of trades to retrieve
   *
   * @type {number}
   * @optional
   * @default 100
   */
  limit?: number;
}

export interface GetFillsParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Address in 42-character hexadecimal format
   *
   * @type {string}
   */
  user: string;
  /**
   * Number of fills to retrieve
   *
   * @type {number}
   * @optional
   * @default 100
   */
  limit?: number;
}

export interface GetTokensParams {
  token?: string;
}

export interface GetMarketInfoParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
}

export interface GetMarketsParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   * @optional
   * @note If not provided, all markets will be returned
   */
  market?: string;
}

export interface SubscribeToMarketParams {
  market: string;
}
export type UnsubscribeFromMarketParams = SubscribeToMarketParams;

export interface SubscribeToOrderbookParams {
  market: string;
  aggregation: number;
}
export type UnsubscribeFromOrderbookParams = SubscribeToOrderbookParams;

export interface SubscribeToOrdersParams {
  market?: string;
}
export type UnsubscribeFromOrdersParams = SubscribeToOrdersParams;

export interface SubscribeToTradesParams {
  market: string;
}
export type UnsubscribeFromTradesParams = SubscribeToTradesParams;

export interface SubscribeToUserOrdersParams {
  user: string;
  market: string;
}
export type UnsubscribeFromUserOrdersParams = SubscribeToUserOrdersParams;

export interface SubscribeToUserFillsParams {
  user: string;
  market: string;
}
export type UnsubscribeFromUserFillsParams = SubscribeToUserFillsParams;
