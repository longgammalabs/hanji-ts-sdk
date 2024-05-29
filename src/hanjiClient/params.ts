import BigNumber from 'bignumber.js';

import type { OrderType, Side } from '../models';

export interface ApproveParams {
  isBaseToken: boolean;
  spenderAddress: string;
  amount: BigNumber | bigint;
}

export interface DepositParams {
  baseTokenAmount: BigNumber | bigint;
  quoteTokenAmount: BigNumber | bigint;
}

interface WithdrawBaseParams {
  baseTokenAmount?: BigNumber | bigint;
  quoteTokenAmount?: BigNumber | bigint;
  withdrawAll?: boolean;
}

interface WithdrawSpecificTokenAmountsParams extends WithdrawBaseParams {
  baseTokenAmount: BigNumber | bigint;
  quoteTokenAmount: BigNumber | bigint;
}

interface WithdrawAllParams extends WithdrawBaseParams {
  withdrawAll: true;
}

export type WithdrawParams =
  | WithdrawSpecificTokenAmountsParams
  | WithdrawAllParams;


export interface PlaceOrderParams {
  type: OrderType;
  side: Side;
  size: string;
  price: string;
  transferExecutedTokens?: boolean;
}

export interface ChangeOrderParams {
  orderId: string;
  new_size: string;
  new_price: string;
  transferExecutedTokens?: boolean;
}

export interface ClaimOrderParams {
  orderId: string;
  transferExecutedTokens?: boolean;
}
