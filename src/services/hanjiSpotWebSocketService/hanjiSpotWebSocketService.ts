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
  SubscribeToOrdersParams, UnsubscribeFromOrdersParams,
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
  allMarketsUpdated: PublicEventEmitter<readonly [data: MarketUpdateDto[]]>;
  marketUpdated: PublicEventEmitter<readonly [data: MarketUpdateDto]>;
  orderbookUpdated: PublicEventEmitter<readonly [data: OrderbookUpdateDto]>;
  ordersUpdated: PublicEventEmitter<readonly [data: OrderUpdateDto[]]>;
  tradesUpdated: PublicEventEmitter<readonly [data: TradeUpdateDto[]]>;
  userOrdersUpdated: PublicEventEmitter<readonly [data: OrderUpdateDto[]]>;
  userFillsUpdated: PublicEventEmitter<readonly [data: FillUpdateDto[]]>;
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

export class HanjiSpotWebSocketService implements Disposable {
  readonly events: HanjiSpotWebSocketServiceEvents = {
    subscriptionError: new EventEmitter(),
    allMarketsUpdated: new EventEmitter(),
    marketUpdated: new EventEmitter(),
    orderbookUpdated: new EventEmitter(),
    ordersUpdated: new EventEmitter(),
    tradesUpdated: new EventEmitter(),
    userOrdersUpdated: new EventEmitter(),
    userFillsUpdated: new EventEmitter()
  };

  protected readonly hanjiWebSocketClient: HanjiWebSocketClient;

  constructor(readonly baseUrl: string, startImmediately = true) {
    this.hanjiWebSocketClient = new HanjiWebSocketClient(baseUrl);
    this.hanjiWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    if (startImmediately)
      this.startHanjiWebSocketClientIfNeeded();
  }

  [Symbol.dispose]() {
    this.hanjiWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.hanjiWebSocketClient.stop();
  }

  subscribeToAllMarkets() {
    this.startHanjiWebSocketClientIfNeeded();
    this.hanjiWebSocketClient.subscribe({
      channel: 'market',
      market: 'allMarkets'
    });
  }

  unsubscribeFromAllMarkets() {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'market',
      market: 'allMarkets'
    });
  }

  subscribeToMarket(params: SubscribeToMarketParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'market',
      market: params.market
    });
  }

  unsubscribeFromMarket(params: UnsubscribeFromMarketParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'market',
      market: params.market
    });
  }

  subscribeToOrderbook(params: SubscribeToOrderbookParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation
    });
  }

  unsubscribeFromOrderbook(params: UnsubscribeFromOrderbookParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation
    });
  }

  subscribeToOrders(params: SubscribeToOrdersParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'orders',
      market: params.market
    });
  }

  unsubscribeFromOrders(params: UnsubscribeFromOrdersParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'orders',
      market: params.market
    });
  }

  subscribeToTrades(params: SubscribeToTradesParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'trades',
      market: params.market
    });
  }

  unsubscribeFromTrades(params: UnsubscribeFromTradesParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'trades',
      market: params.market
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

  protected startHanjiWebSocketClientIfNeeded() {
    this.hanjiWebSocketClient.start()
      .catch(error => console.error(`Hanji Web Socket has not bee started. Error = ${getErrorLogMessage(error)}`));
  }

  protected readonly onSocketMessageReceived = (message: HanjiWebSocketResponseDto) => {
    try {
      if (!message.data)
        return;

      switch (message.channel) {
        case 'allMarkets':
          (this.events.allMarketsUpdated as ToEventEmitter<typeof this.events.allMarketsUpdated>).emit(message.data as MarketUpdateDto[]);
          break;
        case 'market':
          (this.events.marketUpdated as ToEventEmitter<typeof this.events.marketUpdated>).emit(message.data as MarketUpdateDto);
          break;
        case 'orderbook':
          (this.events.orderbookUpdated as ToEventEmitter<typeof this.events.orderbookUpdated>).emit(message.data as OrderbookUpdateDto);
          break;
        case 'orders':
          (this.events.ordersUpdated as ToEventEmitter<typeof this.events.ordersUpdated>).emit(message.data as OrderUpdateDto[]);
          break;
        case 'trades':
          (this.events.tradesUpdated as ToEventEmitter<typeof this.events.tradesUpdated>).emit(message.data as TradeUpdateDto[]);
          break;
        case 'userOrders':
          (this.events.userOrdersUpdated as ToEventEmitter<typeof this.events.userOrdersUpdated>).emit(message.data as OrderUpdateDto[]);
          break;
        case 'userFills':
          (this.events.userFillsUpdated as ToEventEmitter<typeof this.events.userFillsUpdated>).emit(message.data as FillUpdateDto[]);
          break;
        case 'error':
          (this.events.subscriptionError as ToEventEmitter<typeof this.events.subscriptionError>).emit(message.data as string);
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