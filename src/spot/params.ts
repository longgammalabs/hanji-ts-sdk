import BigNumber from 'bignumber.js';

import type { OrderType, Side } from '../models';

export interface ApproveSpotParams {
  isBaseToken: boolean;
  spenderAddress: string;
  amount: BigNumber | bigint;
}

export interface DepositSpotParams {
  baseTokenAmount: BigNumber | bigint;
  quoteTokenAmount: BigNumber | bigint;
}

interface WithdrawBaseSpotParams {
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


export interface PlaceOrderSpotParams {
  type: OrderType;
  side: Side;
  size: string;
  price: string;
  transferExecutedTokens?: boolean;
}

export interface ChangeOrderSpotParams {
  orderId: string;
  new_size: string;
  new_price: string;
  transferExecutedTokens?: boolean;
}

export interface ClaimOrderSpotParams {
  orderId: string;
  transferExecutedTokens?: boolean;
}
