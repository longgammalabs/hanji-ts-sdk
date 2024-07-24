import { CandleResolution, OrderStatus } from '../../models';

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

export interface GetCandlesParams {
  market: string;
  resolution: CandleResolution;
  fromTime?: number;
  toTime?: number;
}
