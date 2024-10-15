import BigNumber from 'bignumber.js';

import { CandleResolution, OrderType, TokenType, Direction, type OrderStatus, type Side, Market, Orderbook } from '../models';

/**
 * Transaction parameters.
 *
 * @interface TransactionParams
 */
interface TransactionParams {
  /**
   * Transaction gas limit.
   * If not provided, the value obtained through an additional `eth_estimateGas` call is used.
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  gasLimit?: BigNumber | bigint;

  /**
   * The maximum fee per unit of gas willing to be paid for the transaction.
   *
   * `maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas`.
   *
   * If not provided the value obtained through an additional `eth_maxPriorityFeePerGas` call is used.
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  maxFeePerGas?: BigNumber | bigint;

  /**
   * The maximum price of the consumed gas to be included as a tip to the validator.
   *
   * If not provided the value obtained through an additional `eth_maxPriorityFeePerGas` call is used.
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  maxPriorityFeePerGas?: BigNumber | bigint;

  /**
   * Transaction nonce (counter).
   * If not provided, the value obtained through an additional `eth_getTransactionCount` call is used.
   *
   * @type {BigNumber | bigint}
   * @optional
   */
  nonce?: BigNumber | bigint;
}

/**
 * Parameters for approving tokens for the token transfer.
 *
 * @interface ApproveSpotParams
 * @extends TransactionParams
 */
export interface ApproveSpotParams extends TransactionParams {
  /**
   * The market identifier.
   *
   * @type {string}
   */
  market: string;
  /**
   * Indicates whether the token to be approved is a base token.
   *
   * @type {boolean}
   */
  isBaseToken: boolean;
  /**
   * The amount of tokens to approve.
   * If `bigint` is provided, then the token's contract unit is used.
   * If `BigNumber` is provided, then the scaled unit with the token's decimals is used.
   *
   * @type {BigNumber | bigint}
   */
  amount: BigNumber | bigint;
}

/**
 * Parameters for depositing tokens into the spot market.
 *
 * @interface DepositSpotParams
 * @extends TransactionParams
 */
export interface DepositSpotParams extends TransactionParams {
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
 *
 * @extends TransactionParams
 */
interface WithdrawBaseSpotParams extends TransactionParams {
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

/**
 * Parameters for withdrawing specific token amounts from the spot market contract.
 *
 * @interface WithdrawSpecificTokenAmountsSpotParams
 * @extends WithdrawBaseSpotParams
 */
interface WithdrawSpecificTokenAmountsSpotParams extends WithdrawBaseSpotParams {
  /**
   * Amount of base tokens to withdraw.
   *
   * @type {BigNumber | bigint}
   */
  baseTokenAmount: BigNumber | bigint;
  /**
   * Amount of quote tokens to withdraw.
   *
   * @type {BigNumber | bigint}
   */
  quoteTokenAmount: BigNumber | bigint;
}

/**
 * Parameters for withdrawing all tokens from the spot market.
 *
 * @interface WithdrawAllSpotParams
 * @extends WithdrawBaseSpotParams
 */
interface WithdrawAllSpotParams extends WithdrawBaseSpotParams {
  /**
   * Flag to withdraw all tokens.
   *
   * @type {true}
   */
  withdrawAll: true;
}

/**
 * Union type for withdraw parameters.
 *
 * @type {WithdrawSpecificTokenAmountsSpotParams | WithdrawAllSpotParams}
 */
export type WithdrawSpotParams =
  | WithdrawSpecificTokenAmountsSpotParams
  | WithdrawAllSpotParams;

/**
 * Parameters for setting claimable status for the spot market.
 *
 * @interface SetClaimableStatusParams
 * @extends TransactionParams
 */
export interface SetClaimableStatusParams extends TransactionParams {
  market: string;
  status: boolean;
}

/**
 * Parameters for placing an order on the spot market.
 *
 * @interface PlaceOrderSpotParams
 * @extends TransactionParams
 */
export interface PlaceOrderSpotParams extends TransactionParams {
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
   * The maximum commission for the order.
   *
   * @type {BigNumber | bigint}
   */
  maxCommission: BigNumber | bigint;

  /**
   * The quantity of native tokens to send for the order.
   * This is the amount of tokens that will be transferred for the order.
   *
   * @type {BigNumber | bigint}
   */
  quantityToSend: BigNumber | bigint;

  /**
   * Whether to transfer executed tokens automatically.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokens?: boolean;

  /**
   * Whether to use the native token for the transaction.
   *
   * @type {boolean}
   * @optional
   */
  useNativeToken?: boolean;
}

/**
 * Parameters for placing an order with a permit on the spot market.
 *
 * @interface PlaceOrderWithPermitSpotParams
 * @extends TransactionParams
 */
export interface PlaceOrderWithPermitSpotParams extends TransactionParams {
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
   * The maximum commission for the order.
   *
   * @type {BigNumber | bigint}
   */
  maxCommission: BigNumber | bigint;

  /**
   * The quantity of tokens to permit for the order.
   *
   * @type {BigNumber | bigint}
   */
  permit: BigNumber | bigint;

  /**
   * Whether to transfer executed tokens automatically.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokens?: boolean;
}

export type PlaceMarketOrderWithTargetValueParams = Omit<PlaceOrderSpotParams, 'type'>;

export type PlaceMarketOrderWithTargetValueWithPermitParams = Omit<PlaceOrderWithPermitSpotParams, 'type'>;

/**
 * Parameters for batch placing orders on the Hanji spot market
 *
 * @interface BatchPlaceOrderSpotParams
 * @extends TransactionParams
 */
export interface BatchPlaceOrderSpotParams extends TransactionParams {
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
 * @extends TransactionParams
 */
export interface ClaimOrderSpotParams extends TransactionParams {
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
   * Keep order after claim or cancel.
   *
   * @type {boolean}
   */
  onlyClaim: boolean;

  /**
   * Whether to transfer tokens to user automatically.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokens?: boolean;
}

/**
 * Parameters for batch claiming orders on the Hanji spot market
 *
 * @interface BatchClaimOrderSpotParams
 * @extends TransactionParams
 */
export interface BatchClaimOrderSpotParams extends TransactionParams {
  market: string;
  claimParams: Array<{
    orderId: string;
    address: string;
  }>;
  onlyClaim: boolean;
}

/**
 * Parameters for changing an existing order on the Hanji Spot market.
 *
 * @interface ChangeOrderSpotParams
 * @extends TransactionParams
 */
export interface ChangeOrderSpotParams extends TransactionParams {
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
   * The maximum commission for the order.
   *
   * @type {BigNumber | bigint}
   */
  maxCommission: BigNumber | bigint;

  /**
   * The quantity of tokens to send for the order.
   * This is the amount of tokens that will be transferred for the order.
   *
   * @type {BigNumber | bigint}
   */
  quantityToSend: BigNumber | bigint;
  /**
   * Whether to transfer executed tokens automatically.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokens?: boolean;
}

/**
 * Parameters for batch changing orders on the Hanji spot market
 *
 * @interface BatchChangeOrderSpotParams
 * @extends TransactionParams
 */
export interface BatchChangeOrderSpotParams extends TransactionParams {
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

/**
 * Parameters for retrieving the order history.
 *
 * @interface GetOrderHistoryParams
 */
export interface GetOrderHistoryParams {
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
   * Number of order history logs to retrieve
   *
   * @type {number}
   * @optional
   * @default 100
   */
  limit?: number;
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

export interface CalculateLimitDetailsParams {
  market: string;
  direction: Direction;
  inputToken: TokenType;
  inputs: {
    priceInput: string;
    tokenXInput: string;
    tokenYInput: string;
    postOnly: boolean;
  };
};

export interface CalculateLimitDetailsSyncParams {
  market: Market;
  direction: Direction;
  inputToken: TokenType;
  inputs: {
    priceInput: string;
    tokenXInput: string;
    tokenYInput: string;
    postOnly: boolean;
  };
};

export interface CalculateMarketDetailsParams {
  market: string;
  direction: Direction;
  inputToken: TokenType;
  inputs: {
    tokenXInput: string;
    tokenYInput: string;
    slippage: number;
    useAutoSlippage?: boolean;
  };
};

export interface CalculateMarketDetailsSyncParams {
  market: Market;
  direction: Direction;
  inputToken: TokenType;
  orderbook: Orderbook['levels'];
  inputs: {
    tokenXInput: string;
    tokenYInput: string;
    slippage: number;
    useAutoSlippage?: boolean;
  };
};

export interface GetUserBalancesParams {
  user: string;
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

export interface SubscribeToUserOrderHistoryParams {
  user: string;
  market?: string;
}
export type UnsubscribeFromUserOrderHistoryParams = SubscribeToUserOrderHistoryParams;

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
