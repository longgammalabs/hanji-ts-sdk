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
  market?: string;
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
