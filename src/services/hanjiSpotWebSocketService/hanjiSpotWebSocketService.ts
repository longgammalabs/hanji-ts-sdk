import type {
  CandleUpdateDto,
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
  SubscribeToUserFillsParams, UnsubscribeFromUserFillsParams,
  SubscribeToCandlesParams,
  UnsubscribeFromCandlesParams
} from './params';
import {
  HanjiWebSocketClient, EventEmitter,
  type HanjiWebSocketResponseDto, type PublicEventEmitter, type ToEventEmitter
} from '../../common';
import { getErrorLogMessage } from '../../logging';

interface HanjiSpotWebSocketServiceEvents {
  marketUpdated: PublicEventEmitter<readonly [marketId: string, data: MarketUpdateDto]>;
  allMarketsUpdated: PublicEventEmitter<readonly [data: MarketUpdateDto[]]>;
  orderbookUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderbookUpdateDto]>;
  tradesUpdated: PublicEventEmitter<readonly [marketId: string, data: TradeUpdateDto[]]>;
  userOrdersUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderUpdateDto[]]>;
  userFillsUpdated: PublicEventEmitter<readonly [marketId: string, data: FillUpdateDto[]]>;
  candlesUpdated: PublicEventEmitter<readonly [marketId: string, data: CandleUpdateDto[]]>;
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

/**
 * HanjiSpotWebSocketService provides methods to interact with the Hanji spot market via WebSocket.
 * It allows subscribing and unsubscribing to various market events such as market updates, orderbook updates,
 * trades, user orders, and user fills.
 */
export class HanjiSpotWebSocketService implements Disposable {
  /**
   * Event emitters for various WebSocket events.
   */
  readonly events: HanjiSpotWebSocketServiceEvents = {
    subscriptionError: new EventEmitter(),
    allMarketsUpdated: new EventEmitter(),
    marketUpdated: new EventEmitter(),
    orderbookUpdated: new EventEmitter(),
    tradesUpdated: new EventEmitter(),
    userOrdersUpdated: new EventEmitter(),
    userFillsUpdated: new EventEmitter(),
    candlesUpdated: new EventEmitter(),
  };

  /**
   * The WebSocket client used to communicate with the Hanji spot market.
   */
  protected readonly hanjiWebSocketClient: HanjiWebSocketClient;

  /**
   * Creates an instance of HanjiSpotWebSocketService.
   * @param baseUrl - The base URL for the WebSocket connection.
   * @param startImmediately - Whether to start the WebSocket client immediately.
   */
  constructor(readonly baseUrl: string, startImmediately = true) {
    this.hanjiWebSocketClient = new HanjiWebSocketClient(baseUrl);
    this.hanjiWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    if (startImmediately)
      this.startHanjiWebSocketClientIfNeeded();
  }

  /**
   * Subscribes to market updates for a given market.
   * @param params - The parameters for the market subscription.
   */
  subscribeToMarket(params: SubscribeToMarketParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'market',
      market: params.market,
    });
  }

  /**
   * Unsubscribes from market updates for a given market.
   * @param params - The parameters for the market unsubscription.
   */
  unsubscribeFromMarket(params: UnsubscribeFromMarketParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'market',
      market: params.market,
    });
  }

  /**
   * Subscribes to all markets.
   */
  subscribeToAllMarkets() {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'allMarkets',
    });
  }

  /**
   * Unsubscribes from all markets.
   */
  unsubscribeFromAllMarkets() {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'allMarkets',
    });
  }

  /**
   * Subscribes to orderbook updates for a given market.
   * @param params - The parameters for the orderbook subscription.
   */
  subscribeToOrderbook(params: SubscribeToOrderbookParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation,
    });
  }

  /**
   * Unsubscribes from orderbook updates for a given market.
   * @param params - The parameters for the orderbook unsubscription.
   */
  unsubscribeFromOrderbook(params: UnsubscribeFromOrderbookParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'orderbook',
      market: params.market,
      aggregation: params.aggregation,
    });
  }

  /**
   * Subscribes to trade updates for a given market.
   * @param params - The parameters for the trade subscription.
   */
  subscribeToTrades(params: SubscribeToTradesParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'trades',
      market: params.market,
    });
  }

  /**
   * Unsubscribes from trade updates for a given market.
   * @param params - The parameters for the trade unsubscription.
   */
  unsubscribeFromTrades(params: UnsubscribeFromTradesParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'trades',
      market: params.market,
    });
  }

  /**
   * Subscribes to user order updates for a given market and user.
   * @param params - The parameters for the user order subscription.
   */
  subscribeToUserOrders(params: SubscribeToUserOrdersParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'userOrders',
      user: params.user,
      market: params.market,
    });
  }

  /**
   * Unsubscribes from user order updates for a given market and user.
   * @param params - The parameters for the user order unsubscription.
   */
  unsubscribeFromUserOrders(params: UnsubscribeFromUserOrdersParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'userOrders',
      user: params.user,
      market: params.market,
    });
  }

  /**
   * Subscribes to user fill updates for a given market and user.
   * @param params - The parameters for the user fill subscription.
   */
  subscribeToUserFills(params: SubscribeToUserFillsParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'userFills',
      user: params.user,
      market: params.market,
    });
  }

  /**
   * Unsubscribes from user fill updates for a given market and user.
   * @param params - The parameters for the user fill unsubscription.
   */
  unsubscribeFromUserFills(params: UnsubscribeFromUserFillsParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'userFills',
      user: params.user,
      market: params.market,
    });
  }

  /**
   * Subscribes to candle updates for a given market and resolution.
   * @param params - The parameters for the candle subscription.
   */
  subscribeToCandles(params: SubscribeToCandlesParams) {
    this.startHanjiWebSocketClientIfNeeded();

    this.hanjiWebSocketClient.subscribe({
      channel: 'candles',
      resolution: params.resolution,
      market: params.market,
    });
  }

  /**
   * Unsubscribes from candle updates for a given market and resolution.
   * @param params - The parameters for the candle unsubscription.
   */
  unsubscribeFromCandles(params: UnsubscribeFromCandlesParams) {
    this.hanjiWebSocketClient.unsubscribe({
      channel: 'candles',
      resolution: params.resolution,
      market: params.market,
    });
  }

  /**
   * Disposes the WebSocket client and removes the message listener.
   */
  [Symbol.dispose]() {
    this.hanjiWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.hanjiWebSocketClient.stop();
  }

  /**
   * Starts the WebSocket client if it is not already started.
   */
  protected startHanjiWebSocketClientIfNeeded() {
    this.hanjiWebSocketClient.start()
      .catch(error => console.error(`Hanji Web Socket has not been started. Error = ${getErrorLogMessage(error)}`));
  }

  /**
   * Handles incoming WebSocket messages and emits the appropriate events.
   * @param message - The WebSocket message received.
   */
  protected readonly onSocketMessageReceived = (message: HanjiWebSocketResponseDto) => {
    try {
      if (!message.data)
        return;

      switch (message.channel) {
        case 'allMarkets':
          (this.events.allMarketsUpdated as ToEventEmitter<typeof this.events.allMarketsUpdated>).emit(message.data as MarketUpdateDto[]);
          break;
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
        case 'candles':
          (this.events.candlesUpdated as ToEventEmitter<typeof this.events.candlesUpdated>).emit(message.id, message.data as CandleUpdateDto[]);
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
