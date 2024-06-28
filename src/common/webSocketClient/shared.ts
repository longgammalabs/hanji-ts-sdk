import type { PublicEventEmitter } from '../eventEmitter';

export const enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3
}

export interface WebSocketClient<TSocket, TOpenEvent, TCloseEvent> {
  readonly events: {
    messageReceived: PublicEventEmitter<readonly [message: unknown]>;
    opened: PublicEventEmitter<readonly [socket: TSocket, event: TOpenEvent]>;
    closed: PublicEventEmitter<readonly [socket: TSocket, event: TCloseEvent]>;
  };

  get readyState(): ReadyState;

  connect(): Promise<void>;
  disconnect(): void;
  send<TMessage>(message: TMessage): void;
}
