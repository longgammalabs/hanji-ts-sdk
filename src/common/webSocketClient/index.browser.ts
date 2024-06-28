import type { WebSocketClient as WebSocketClientInterface } from './shared';
import { EventEmitter, type ToEventEmitter } from '../eventEmitter';

export type WebSocketOpenEvent = WebSocketEventMap['open'];
export type WebSocketCloseEvent = WebSocketEventMap['close'];

export class WebSocketClient implements WebSocketClientInterface<WebSocketClient, WebSocketOpenEvent, WebSocketCloseEvent> {
  readonly events: WebSocketClientInterface<WebSocketClient, WebSocketOpenEvent, WebSocketCloseEvent>['events'] = {
    messageReceived: new EventEmitter(),
    opened: new EventEmitter(),
    closed: new EventEmitter(),
  };

  get readyState() {
    return this.socket.readyState;
  }

  protected _socket: WebSocket | undefined;

  protected get socket(): WebSocket {
    if (!this._socket)
      throw new Error('Internal websocket is not created. Use the connect method first');

    return this._socket;
  }

  constructor(protected readonly url: string | URL) {
  }

  async connect(): Promise<void> {
    this.disconnect();

    return new Promise((resolve, reject) => {
      this._socket = new WebSocket(this.url);

      const onOpen = () => {
        this.socket.removeEventListener('open', onOpen);
        resolve();
      };
      const onError = (error: unknown) => {
        this.socket.removeEventListener('error', onError);
        reject(error);
      };
      this.socket.addEventListener('open', onOpen);
      this.socket.addEventListener('error', onError);

      this.socket.addEventListener('open', this.onOpened);
      this.socket.addEventListener('message', this.onMessageReceived);
      this.socket.addEventListener('error', this.onError);
      this.socket.addEventListener('close', this.onClosed);
    });
  }

  disconnect() {
    if (!this._socket)
      return;

    this.socket.removeEventListener('open', this.onOpened);
    this.socket.removeEventListener('message', this.onMessageReceived);
    this.socket.removeEventListener('error', this.onError);
    this.socket.removeEventListener('close', this.onClosed);
    this.socket.close();
  }

  send<T>(message: T) {
    this.socket.send(JSON.stringify(message));
  }

  protected onMessageReceived = (event: MessageEvent<string>) => {
    try {
      const data = JSON.parse(event.data);

      (this.events.messageReceived as ToEventEmitter<typeof this.events.messageReceived>).emit(data);
    }
    catch (error) {
      console.error(error);
    }
  };

  protected onError = (event: Event) => {
    throw new Error(`Websocket received error: ${JSON.stringify(event)}`);
  };

  protected onOpened = (event: WebSocketOpenEvent) => {
    (this.events.opened as ToEventEmitter<typeof this.events.opened>).emit(this, event);
  };

  protected onClosed = (event: WebSocketCloseEvent) => {
    (this.events.closed as ToEventEmitter<typeof this.events.closed>).emit(this, event);
  };
}
