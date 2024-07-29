import BigNumber from 'bignumber.js';

import { CandleResolution, OrderType, type OrderStatus, type Side } from '../models';

export interface ApproveSpotParams {
  market: string;
  isBaseToken: boolean;
  amount: BigNumber | bigint;
}

/**
 * Parameters for depositing tokens into the spot market.
 */
export interface DepositSpotParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Amount of base tokens to deposit.
   * Actual amount divided by base token scaling factor.
   *
   * @type {BigNumber | bigint}
   */
  baseTokenAmount: BigNumber | bigint;
  /**
   * Amount of quote tokens to deposit.
   * Actual amount divided by quote token scaling factor.
   *
   * @type {BigNumber | bigint}
   */
  quoteTokenAmount: BigNumber | bigint;
}

/**
 * Base parameters for withdrawing tokens from the spot market.
 */
interface WithdrawBaseSpotParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;
  /**
   * Amount of base tokens to withdraw
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  baseTokenAmount?: BigNumber | bigint;
  /**
   * Amount of quote tokens to withdraw
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  quoteTokenAmount?: BigNumber | bigint;
  /**
   * Flag to withdraw all tokens
   *
   * @type {boolean}
   * @optional
   */
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

/**
 * Parameters for placing an order on the spot market.
 *
 * @interface PlaceOrderSpotParams
 */
export interface PlaceOrderSpotParams {
  /**
   * The ID of the market where the order will be placed.
   *
   * @type {string}
   */
  market: string;

  /**
   * The type of the order (e.g., limit, market).
   *
   * @type {OrderType}
   */
  type: OrderType;

  /**
   * The side of the order (buy or sell).
   *
   * @type {Side}
   */
  side: Side;

  /**
   * The size of the order. The amount of tokens to order divided by the scaling factor.
   * This amount would be multiplied by the scaling factor inside the function
   *
   * @type {BigNumber | bigint}
   */
  size: BigNumber | bigint;

  /**
   * The price at which the order will be placed.
   * No more than 6 significant digits.
   * Calculated as `real_price * scaling_factor_token_x / scaling_factor_token_y`
   *
   * @type {BigNumber | bigint}
   */
  price: BigNumber | bigint;

  /**
   * Whether to transfer executed tokens automatically.
   *
   * @type {boolean}
   * @optional
   */
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

/**
 * Parameters for claiming an order on the Hanji Spot market.
 *
 * @interface ClaimOrderSpotParams
 */
export interface ClaimOrderSpotParams {
  /**
   * The market identifier where the order exists.
   *
   * @type {string}
   */
  market: string;

  /**
   * The unique identifier of the order to be claimed.
   *
   * @type {string}
   */
  orderId: string;

  /**
   * Whether to transfer tokens to user automatically.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokens?: boolean;
}

export interface BatchClaimOrderSpotParams {
  market: string;
  claimParams: Array<{
    orderId: string;
    address: string;
  }>;
}

/**
 * Parameters for changing an existing order on the Hanji Spot market.
 *
 * @interface ChangeOrderSpotParams
 */
export interface ChangeOrderSpotParams {
  /**
   * The market identifier where the order exists.
   *
   * @type {string}
   */
  market: string;

  /**
   * The unique identifier of the order to be changed.
   *
   * @type {string}
   */
  orderId: string;

  /**
   * The new size of the order. The amount of tokens to order divided by the scaling factor.
   * This amount would be multiplied by the scaling factor inside the function.
   *
   * @type {BigNumber | bigint}
   */
  newSize: BigNumber | bigint;

  /**
   * The new price at which the order will be placed.
   * No more than 6 significant digits.
   * Calculated as `real_price * scaling_factor_token_x / scaling_factor_token_y`.
   *
   * @type {BigNumber | bigint}
   */
  newPrice: BigNumber | bigint;

  /**
   * The type of the order, either 'limit' or 'limit_post_only'.
   *
   * @type {'limit' | 'limit_post_only'}
   */
  type: 'limit' | 'limit_post_only';

  /**
   * Whether to transfer executed tokens automatically.
   *
   * @type {boolean}
   * @optional
   */
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

export interface GetMarketParams {
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

/**
 * Parameters for retrieving candle data for a specific market.
 */
export interface GetCandlesParams {
  /**
   * Id of the requested market
   *
   * @type {string}
   */
  market: string;

  /**
   * Resolution of the candles to retrieve
   *
   * @type {CandleResolution}
   */
  resolution: CandleResolution;

  /**
   * Start time for the candle data in Unix timestamp format
   *
   * @type {number}
   * @optional
   */
  fromTime?: number;

  /**
   * End time for the candle data in Unix timestamp format
   *
   * @type {number}
   * @optional
   */
  toTime?: number;
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
  market?: string;
}
export type UnsubscribeFromUserOrdersParams = SubscribeToUserOrdersParams;

export interface SubscribeToUserFillsParams {
  user: string;
  market?: string;
}
export type UnsubscribeFromUserFillsParams = SubscribeToUserFillsParams;

export interface SubscribeToCandlesParams {
  market: string;
  resolution: CandleResolution;
}
export type UnsubscribeFromCandlesParams = SubscribeToCandlesParams;
