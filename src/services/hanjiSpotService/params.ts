import { CandleResolution, Direction, OrderStatus, TokenType } from '../../models';

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

export interface GetOrderHistoryParams {
  market: string;
  user: string;
  limit?: number;
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

export interface GetCandlesParams {
  market: string;
  resolution: CandleResolution;
  fromTime?: number;
  toTime?: number;
}

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
}

export interface GetUserBalancesParams {
  user: string;
}
