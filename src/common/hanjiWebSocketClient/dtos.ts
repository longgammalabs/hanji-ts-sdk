export interface SubscribeToSubscriptionWebSocketRequestDto<TSubscription = unknown> {
  method: 'subscribe',
  subscription: TSubscription;
}

export interface UnsubscribeFromSubscriptionWebSocketRequestDto<TSubscription = unknown> {
  method: 'unsubscribe',
  subscription: TSubscription;
}

export interface HanjiWebSocketResponseDto {
  channel: string;
  data: unknown;
}
