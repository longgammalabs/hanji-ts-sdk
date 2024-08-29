import { CandleResolution } from '../../models';

export interface SubscribeToMarketParams {
  market: string;
}
export type UnsubscribeFromMarketParams = SubscribeToMarketParams;

export interface SubscribeToOrderbookParams {
  market: string;
  aggregation: number;
}
export type UnsubscribeFromOrderbookParams = SubscribeToOrderbookParams;

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
