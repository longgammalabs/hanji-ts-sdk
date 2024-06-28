import type {
  FillUpdateDto,
  MarketUpdateDto,
  OrderUpdateDto,
  OrderbookUpdateDto,
  TradeUpdateDto
} from './dtos';
import type {
  SubscribeToMarketParams, UnsubscribeFromMarketParams,
  SubscribeToOrderbookParams, UnsubscribeFromOrderbookParams,
  SubscribeToTradesParams, UnsubscribeFromTradesParams,
  SubscribeToUserOrdersParams, UnsubscribeFromUserOrdersParams,
  SubscribeToUserFillsParams, UnsubscribeFromUserFillsParams
} from './params';
import {
  HanjiWebSocketClient, EventEmitter,
  type HanjiWebSocketResponseDto, type PublicEventEmitter, type ToEventEmitter
} from '../../common';
import { getErrorLogMessage } from '../../logging';

interface HanjiSpotWebSocketServiceEvents {
  marketUpdated: PublicEventEmitter<readonly [marketId: string, data: MarketUpdateDto]>;
  orderbookUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderbookUpdateDto]>;
  tradesUpdated: PublicEventEmitter<readonly [marketId: string, data: TradeUpdateDto[]]>;
  userOrdersUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderUpdateDto[]]>;
  userFillsUpdated: PublicEventEmitter<readonly [marketId: string, data: FillUpdateDto[]]>;
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

export class HanjiSpotWebSocketService implements Disposable {
  readonly events: HanjiSpotWebSocketServiceEvents = {
    subscriptionError: new EventEmitter(),
    marketUpdated: new EventEmitter(),
    orderbookUpdated: new EventEmitter(),
    tradesUpdated: new EventEmitter(),
    userOrdersUpdated: new EventEmitter(),
    userFillsUpdated: new EventEmitter(),
  };

  protected readonly hanjiWebSocketClient: HanjiWebSocketClient;

  constructor(readonly baseUrl: string, startImmediately = true) {
    this.hanjiWebSocketClient = new HanjiWebSocketClient(baseUrl);
    this.hanjiWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    if (startImmediately)
      this.startHanjiWebSocketClientIfNeeded();
  }

  subscribeToMarket(params: SubscribeToMarketParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'market',
      market: params.market,
    });
  }

  unsubscribeFromMarket(params: UnsubscribeFromMarketParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'market',
      market: params.market,
    });
  }

  subscribeToOrderbook(params: SubscribeToOrderbookParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation,
    });
  }

  unsubscribeFromOrderbook(params: UnsubscribeFromOrderbookParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation,
    });
  }

  subscribeToTrades(params: SubscribeToTradesParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'trades',
      market: params.market,
    });
  }

  unsubscribeFromTrades(params: UnsubscribeFromTradesParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'trades',
      market: params.market,
    });
  }

  subscribeToUserOrders(params: SubscribeToUserOrdersParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'userOrders',
      user: params.user,
      market: params.market,
    });
  }

  unsubscribeFromUserOrders(params: UnsubscribeFromUserOrdersParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'userOrders',
      user: params.user,
      market: params.market,
    });
  }

  subscribeToUserFills(params: SubscribeToUserFillsParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'userFills',
      user: params.user,
      market: params.market,
    });
  }

  unsubscribeFromUserFills(params: UnsubscribeFromUserFillsParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'userFills',
      user: params.user,
      market: params.market,
    });
  }

  [Symbol.dispose]() {
    this.hanjiWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.hanjiWebSocketClient.stop();
  }

  protected startHanjiWebSocketClientIfNeeded() {
    this.hanjiWebSocketClient.start()
      .catch(error => console.error(`Hanji Web Socket has not bee started. Error = ${getErrorLogMessage(error)}`));
  }

  protected readonly onSocketMessageReceived = (message: HanjiWebSocketResponseDto) => {
    try {
      if (!message.data)
        return;

      switch (message.channel) {
        case 'market':
          (this.events.marketUpdated as ToEventEmitter<typeof this.events.marketUpdated>).emit(message.id, message.data as MarketUpdateDto);
          break;
        case 'orderbook':
          (this.events.orderbookUpdated as ToEventEmitter<typeof this.events.orderbookUpdated>).emit(message.id, message.data as OrderbookUpdateDto);
          break;
        case 'trades':
          (this.events.tradesUpdated as ToEventEmitter<typeof this.events.tradesUpdated>).emit(message.id, message.data as TradeUpdateDto[]);
          break;
        case 'userOrders':
          (this.events.userOrdersUpdated as ToEventEmitter<typeof this.events.userOrdersUpdated>).emit(message.id, message.data as OrderUpdateDto[]);
          break;
        case 'userFills':
          (this.events.userFillsUpdated as ToEventEmitter<typeof this.events.userFillsUpdated>).emit(message.id, message.data as FillUpdateDto[]);
          break;
        case 'error':
          (this.events.subscriptionError as ToEventEmitter<typeof this.events.subscriptionError>).emit(message.data as string);
          break;
        case 'subscriptionResponse':
          break;
        default:
          console.warn('Unknown channel in the socket message handler.', message.channel);
      }
    }
    catch (error: unknown) {
      console.error('Unknown error in the socket message handler.', getErrorLogMessage(error));
    }
  };
}
