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
  type: OrderType.LIMIT | OrderType.LIMIT_POST_ONLY;
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
  type: OrderType.LIMIT | OrderType.LIMIT_POST_ONLY;
  transferExecutedTokens?: boolean;
}

export interface BatchChangeOrderSpotParams {
  market: string;
  orderParams: Array<{
    orderId: string;
    newSize: BigNumber | bigint;
    newPrice: BigNumber | bigint;
  }>;
  type: OrderType.LIMIT | OrderType.LIMIT_POST_ONLY;
  transferExecutedTokens?: boolean;
}

export interface GetOrderbookParams {
  market: string;
  aggregation?: number;
  limit?: number;
}

export interface GetOrdersParams {
  market: string;
  user: string;
  limit?: number;
  status?: OrderStatus | OrderStatus[];
}

export interface GetTradesParams {
  market: string;
  limit?: number;
}

export interface GetFillsParams {
  market: string;
  user: string;
  limit?: number;
}

export interface GetTokensParams {
  token?: string;
}

export interface GetMarketsParams {
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
