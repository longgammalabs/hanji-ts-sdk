import type { ContractTransactionResponse } from 'ethers';
import type { Provider, Signer } from 'ethers/providers';

import { HanjiSpotMarketContract } from './hanjiSpotMarketContract';
import * as mappers from './mappers';
import type {
  ApproveSpotParams,
  BatchChangeOrderSpotParams,
  BatchClaimOrderSpotParams,
  BatchPlaceOrderSpotParams,
  ChangeOrderSpotParams,
  ClaimOrderSpotParams,
  DepositSpotParams,
  GetFillsParams,
  GetMarketInfoParams,
  GetMarketsParams,
  GetOrderbookParams,
  GetOrdersParams,
  GetTokensParams,
  GetTradesParams,
  GetCandlesParams,
  PlaceOrderSpotParams,
  SetClaimableStatusParams,
  SubscribeToMarketParams,
  SubscribeToOrderbookParams,
  SubscribeToTradesParams,
  SubscribeToUserFillsParams,
  SubscribeToUserOrdersParams,
  UnsubscribeFromMarketParams,
  UnsubscribeFromOrderbookParams,
  UnsubscribeFromTradesParams,
  UnsubscribeFromUserFillsParams,
  UnsubscribeFromUserOrdersParams,
  WithdrawSpotParams,
  SubscribeToCandlesParams,
  UnsubscribeFromCandlesParams
} from './params';
import { EventEmitter, type PublicEventEmitter, type ToEventEmitter } from '../common';
import { getErrorLogMessage } from '../logging';
import type { Market, FillUpdate, MarketUpdate, OrderUpdate, OrderbookUpdate, TradeUpdate, Orderbook, Order, Trade, Fill, Token, MarketInfo, Candle, CandleUpdate } from '../models';
import { HanjiSpotService, HanjiSpotWebSocketService } from '../services';

/**
 * Options for configuring the HanjiSpot instance.
 *
 * @interface HanjiSpotOptions
 */
export interface HanjiSpotOptions {
  /**
   * The base URL for the Hanji API.
   *
   * @type {string}
   */
  apiBaseUrl: string;

  /**
   * The base URL for the Hanji WebSocket API.
   *
   * @type {string}
   */
  webSocketApiBaseUrl: string;

  /**
   * The ethers signer or provider used for signing transactions.
   * For only http/ws operations, you can set this to null.
   *
   * @type {Signer | Provider | null}
   */
  signerOrProvider: Signer | Provider | null;

  /**
   * Whether to connect to the WebSocket immediately after creating the HanjiSpot (true)
   * or when the first subscription is called (false).
   * By default, the WebSocket is connected immediately.
   *
   * @type {boolean}
   * @optional
   */
  webSocketConnectImmediately?: boolean;

  /**
   * Whether to enable the transfer of executed tokens.
   *
   * @type {boolean}
   * @optional
   */
  transferExecutedTokensEnabled?: boolean;

  /**
   * Whether to automatically wait for transactions to be confirmed.
   *
   * @type {boolean}
   * @optional
   */
  autoWaitTransaction?: boolean;
}

/**
 * Events are emitted when data related to subscriptions is updated.
 */
interface HanjiSpotEvents {
  /**
   * Emitted when a market's data is updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: MarketUpdate]>}
   */
  marketUpdated: PublicEventEmitter<readonly [marketId: string, data: MarketUpdate]>;

  /**
   * Emitted when a market's orderbook is updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: OrderbookUpdate]>}
   */
  orderbookUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderbookUpdate]>;

  /**
   * Emitted when a market's trades are updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: TradeUpdate[]]>}
   */
  tradesUpdated: PublicEventEmitter<readonly [marketId: string, data: TradeUpdate[]]>;

  /**
   * Emitted when a user's orders are updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: OrderUpdate[]]>}
   */
  userOrdersUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderUpdate[]]>;

  /**
   * Emitted when a user's fills are updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: FillUpdate[]]>}
   */
  userFillsUpdated: PublicEventEmitter<readonly [marketId: string, data: FillUpdate[]]>;

  /**
   * Emitted when a market's candle is updated.
   * @event
   * @type {PublicEventEmitter<readonly [marketId: string, data: CandleUpdate[]]>}
   */
  candlesUpdated: PublicEventEmitter<readonly [marketId: string, data: CandleUpdate[]]>;

  /**
   * Emitted when there is an error related to a subscription.
   * @event
   * @type {PublicEventEmitter<readonly [error: string]>}
   */
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

/**
 * The HanjiSpot is a class for interacting with the Hanji Spot API.
 * It provides methods for retrieving market information, subscribing to market updates,
 * placing orders, managing user orders and fills, and and more.
 * Use the {@link HanjiClient#events} property to handle subscription events.
 */
export class HanjiSpot implements Disposable {
  /**
   * The events related to user subscriptions.
   *
   * These events are emitted when data is updated related to subscriptions.
   */
  readonly events: HanjiSpotEvents = {
    subscriptionError: new EventEmitter(),
    marketUpdated: new EventEmitter(),
    orderbookUpdated: new EventEmitter(),
    tradesUpdated: new EventEmitter(),
    userOrdersUpdated: new EventEmitter(),
    userFillsUpdated: new EventEmitter(),
    candlesUpdated: new EventEmitter(),
  };

  /**
   * Indicates whether executed tokens should be transferred to the wallet or credited to the balance.
   * When true, executed tokens will be transferred to the wallet. When false, executed tokens will be credited to the balance.
   * If not set, the default value will be used.
   * This flag is used by the Hanji Spot contract.
   */
  transferExecutedTokensEnabled: boolean | undefined;
  /**
   * Indicates whether transactions should be automatically waited for by the client.
   * When true, transactions will be automatically waited for by the client until confirmation is received.
   * When false, transactions will not be waited for by the client.
   * If not set, the default value will be used.
   * This flag is used by the Hanji Spot contract.
   *
   * Note: "Wait" means that the client will wait until the transaction confirmation is received.
   */
  autoWaitTransaction: boolean | undefined;

  protected signerOrProvider: Signer | Provider | null;
  protected readonly hanjiService: HanjiSpotService;
  protected readonly hanjiWebSocketService: HanjiSpotWebSocketService;
  protected readonly marketContracts: Map<string, HanjiSpotMarketContract> = new Map();
  protected readonly marketInfos: Map<string, MarketInfo> = new Map();
  protected readonly mappers: typeof mappers;
  private readonly marketInfoPromises: Map<string, Promise<Market[]>> = new Map();

  constructor(options: Readonly<HanjiSpotOptions>) {
    this.signerOrProvider = options.signerOrProvider;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction;
    this.hanjiService = new HanjiSpotService(options.apiBaseUrl);
    this.hanjiWebSocketService = new HanjiSpotWebSocketService(options.webSocketApiBaseUrl, options.webSocketConnectImmediately);
    this.mappers = mappers;

    this.attachEvents();
  }

  /**
   * Sets a new signer or provider for the HanjiSpot instance.
   *
   * @param {Signer | Provider} signerOrProvider - The new signer or provider to be set.
   * @returns {HanjiSpot} Returns the HanjiSpot instance for method chaining.
   */
  setSignerOrProvider(signerOrProvider: Signer | Provider): HanjiSpot {
    this.signerOrProvider = signerOrProvider;
    return this;
  }

  /**
  * Approves the specified amount of tokens for the corresponding market contract.
  * You need to approve the tokens before you can deposit or place an order.
  *
  * @param {ApproveSpotParams} params - The parameters for approving tokens.
  * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
  */
  async approveTokens(params: ApproveSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.approveTokens(params);
  }

  /**
  * Deposits the specified amount of tokens to the corresponding market contract.
  * You need to approve the tokens before you can deposit them.
  * Use the {@link HanjiSpot#approveTokens} method for that.
  *
  * @param {DepositSpotParams} params - The parameters for depositing tokens.
  * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
  */
  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.depositTokens(params);
  }

  /**
   * Withdraws the specified amount of tokens from the corresponding market contract.
   * If withdrawAll is true, the entire balance of tokens will be withdrawn.
   *
   * @param {WithdrawSpotParams} params - The parameters for withdrawing tokens.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async withdrawTokens(params: WithdrawSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.withdrawTokens(params);
  }

  /**
   * Sets the claimable status for corresponding market contract.
   *
   * @param {SetClaimableStatusParams} params - The parameters for setting the claimable status.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async setClaimableStatus(params: SetClaimableStatusParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.setClaimableStatus(params);
  }

  /**
   * Places a new order in the corresponding market contract.
   *
   * @param {PlaceOrderSpotParams} params - The parameters for placing a new order.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async placeOrder(params: PlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.placeOrder(params);
  }

  /**
   * Places multiple orders in the corresponding market contract.
   *
   * @param {BatchPlaceOrderSpotParams} params - The parameters for placing multiple orders.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchPlaceOrder(params);
  }

  /**
   * Claims an order or fully cancel it in the corresponding market contract.
   *
   * @param {ClaimOrderSpotParams} params - The parameters for claiming an order.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.claimOrder(params);
  }

  /**
   * Claims multiple orders or fully cancels them in the corresponding market contract.
   *
   * @param {BatchClaimOrderSpotParams} params - The parameters for claiming multiple orders.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async batchClaim(params: BatchClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchClaim(params);
  }

  /**
   * Change an existing order in the corresponding market contract.
   *
   * @param {ChangeOrderSpotParams} params - The parameters for changing an existing order.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.changeOrder(params);
  }

  /**
   * Change multiple existing orders in the corresponding market contract.
   *
   * @param {BatchChangeOrderSpotParams} params - The parameters for changing multiple existing orders.
   * @return {Promise<ContractTransactionResponse>} A Promise that resolves to the transaction response.
   */
  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchChangeOrder(params);
  }

  /**
   * Retrieves the market information for the specified market.
   *
   * @param {GetMarketInfoParams} params - The parameters for retrieving the market information.
   * @returns {Promise<MarketInfo | undefined>} A Promise that resolves to the market information or undefined if the market is not found.
   */
  async getMarketInfo(params: GetMarketInfoParams): Promise<MarketInfo | undefined> {
    let marketInfo = this.marketInfos.get(params.market);

    if (!marketInfo) {
      let market: Market | undefined;
      try {
        let getMarketInfoPromise = this.marketInfoPromises.get(params.market);
        if (!getMarketInfoPromise) {
          getMarketInfoPromise = this.getMarkets(params);
          this.marketInfoPromises.set(params.market, getMarketInfoPromise);
        }

        const markets = await getMarketInfoPromise;
        market = markets[0];

        this.marketInfoPromises.delete(params.market);
      }
      catch (error) {
        console.error(error);
      }
      if (!market)
        return undefined;

      marketInfo = {
        id: market.name,
        name: market.name,
        symbol: market.symbol,
        baseToken: market.baseToken,
        quoteToken: market.quoteToken,
        orderbookAddress: market.orderbookAddress,
        scalingFactors: this.getScalingFactors(market.baseToken, market.quoteToken),
      };
      this.marketInfos.set(params.market, marketInfo);
    }

    return marketInfo;
  }

  /**
   * Retrieves the markets.
   *
   * @param {GetMarketsParams} params - The parameters for retrieving the markets.
   * @returns {Promise<Market[]>} A Promise that resolves to an array of markets.
   */
  async getMarkets(params: GetMarketsParams): Promise<Market[]> {
    const marketDtos = await this.hanjiService.getMarkets(params);
    const markets = marketDtos.map(marketDto => this.mappers.mapMarketDtoToMarket(
      marketDto,
      this.getScalingFactors(marketDto.baseToken, marketDto.quoteToken).price
    ));

    return markets;
  }

  /**
   * Retrieves the tokens.
   *
   * @param {GetTokensParams} params - The parameters for retrieving the tokens.
   * @returns {Promise<Token[]>} A Promise that resolves to an array of tokens.
   */
  async getTokens(params: GetTokensParams): Promise<Token[]> {
    const tokenDtos = await this.hanjiService.getTokens(params);
    const tokens = tokenDtos.map(this.mappers.mapTokenDtoToToken);

    return tokens;
  }

  /**
   * Retrieves the orderbook for the specified market.
   *
   * @param {GetOrderbookParams} params - The parameters for retrieving the orderbook.
   * @returns {Promise<Orderbook>} A Promise that resolves to the orderbook.
   */
  async getOrderbook(params: GetOrderbookParams): Promise<Orderbook> {
    const [marketInfo, orderbookDto] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getOrderbook(params),
    ]);
    const orderbook = this.mappers.mapOrderbookDtoToOrderbook(orderbookDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken);

    return orderbook;
  }

  /**
   * Retrieves the orders for the specified market.
   *
   * @param {GetOrdersParams} params - The parameters for retrieving the orders.
   * @returns {Promise<Order[]>} A Promise that resolves to an array of orders.
   */
  async getOrders(params: GetOrdersParams): Promise<Order[]> {
    const [marketInfo, orderDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getOrders(params),
    ]);
    const orders = orderDtos.map(orderDto => this.mappers.mapOrderDtoToOrder(orderDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return orders;
  }

  /**
   * Retrieves the trades for the specified market.
   *
   * @param {GetTradesParams} params - The parameters for retrieving the trades.
   * @returns {Promise<Trade[]>} A Promise that resolves to an array of trades.
   */
  async getTrades(params: GetTradesParams): Promise<Trade[]> {
    const [marketInfo, tradeDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getTrades(params),
    ]);
    const trades = tradeDtos.map(tradeDto => this.mappers.mapTradeDtoToTrade(tradeDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return trades;
  }

  /**
   * Retrieves the fills for the specified market.
   *
   * @param {GetFillsParams} params - The parameters for retrieving the fills.
   * @returns {Promise<Fill[]>} A Promise that resolves to an array of fills.
   */
  async getFills(params: GetFillsParams): Promise<Fill[]> {
    const [marketInfo, fillDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getFills(params),
    ]);
    const fills = fillDtos.map(fillDto => this.mappers.mapFillDtoToFill(fillDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return fills;
  }

  /**
   * Retrieves the candles for the specified market and resolution.
   *
   * @param {GetCandlesParams} params - The parameters for retrieving the candles.
   * @returns {Promise<Candle[]>} A Promise that resolves to an array of candles.
   */
  async getCandles(params: GetCandlesParams): Promise<Candle[]> {
    const candles = await this.hanjiService.getCandles(params);

    return candles;
  }

  /**
   * Subscribes to the market updates for the specified market.
   *
   * @param {SubscribeToMarketParams} params - The parameters for subscribing to the market updates.
   * @emits HanjiSpot#events#marketUpdated
   */
  subscribeToMarket(params: SubscribeToMarketParams): void {
    this.hanjiWebSocketService.subscribeToMarket(params);
  }

  /**
   * Unsubscribes from the market updates for the specified market.
   *
   * @param {UnsubscribeFromMarketParams} params - The parameters for unsubscribing from the market updates.
   */
  unsubscribeFromMarket(params: UnsubscribeFromMarketParams): void {
    this.hanjiWebSocketService.unsubscribeFromMarket(params);
  }

  /**
   * Subscribes to the orderbook updates for the specified market and aggregation level.
   *
   * @param {SubscribeToOrderbookParams} params - The parameters for subscribing to the orderbook updates.
   * @emits HanjiSpot#events#orderbookUpdated
   */
  subscribeToOrderbook(params: SubscribeToOrderbookParams): void {
    this.hanjiWebSocketService.subscribeToOrderbook(params);
  }

  /**
   * Unsubscribes from the orderbook updates for the specified market and aggregation level.
   *
   * @param {UnsubscribeFromOrderbookParams} params - The parameters for unsubscribing from the orderbook updates.
   */
  unsubscribeFromOrderbook(params: UnsubscribeFromOrderbookParams): void {
    this.hanjiWebSocketService.unsubscribeFromOrderbook(params);
  }

  /**
   * Subscribes to the trade updates for the specified market.
   *
   * @param {SubscribeToTradesParams} params - The parameters for subscribing to the trade updates.
   * @emits HanjiSpot#events#tradesUpdated
   */
  subscribeToTrades(params: SubscribeToTradesParams): void {
    this.hanjiWebSocketService.subscribeToTrades(params);
  }

  /**
   * Unsubscribes from the trade updates for the specified market.
   *
   * @param {UnsubscribeFromTradesParams} params - The parameters for unsubscribing from the trade updates.
   */
  unsubscribeFromTrades(params: UnsubscribeFromTradesParams): void {
    this.hanjiWebSocketService.unsubscribeFromTrades(params);
  }

  /**
   * Subscribes to the user orders updates for the specified market and user.
   *
   * @param {SubscribeToUserOrdersParams} params - The parameters for subscribing to the user orders updates.
   * @emits HanjiSpot#events#ordersUpdated
   */
  subscribeToUserOrders(params: SubscribeToUserOrdersParams): void {
    this.hanjiWebSocketService.subscribeToUserOrders(params);
  }

  /**
   * Unsubscribes from the user orders updates for the specified market and user.
   *
   * @param {UnsubscribeFromUserOrdersParams} params - The parameters for unsubscribing from the user orders updates.
   * @emits HanjiSpot#events#ordersUpdated
   */
  unsubscribeFromUserOrders(params: UnsubscribeFromUserOrdersParams): void {
    this.hanjiWebSocketService.unsubscribeFromUserOrders(params);
  }

  /**
   * Subscribes to the user fills updates for the specified market and user.
   *
   * @param {SubscribeToUserFillsParams} params - The parameters for subscribing to the user fills updates.
   * @emits HanjiSpot#events#userFillsUpdated
   */
  subscribeToUserFills(params: SubscribeToUserFillsParams): void {
    this.hanjiWebSocketService.subscribeToUserFills(params);
  }

  /**
   * Unsubscribes from the user fills updates for the specified market and user.
   *
   * @param {UnsubscribeFromUserFillsParams} params - The parameters for unsubscribing from the user fills updates.
   * @emits HanjiSpot#events#userFillsUpdated
   */
  unsubscribeFromUserFills(params: UnsubscribeFromUserFillsParams): void {
    this.hanjiWebSocketService.unsubscribeFromUserFills(params);
  }

  /**
   * Subscribes to candle updates for the specified market and resolution.
   *
   * @param {SubscribeToCandlesParams} params - The parameters for subscribing to the candle updates.
   */
  subscribeToCandles(params: SubscribeToCandlesParams): void {
    this.hanjiWebSocketService.subscribeToCandles(params);
  }

  /**
   * Unsubscribes from candle updates for the specified market and resolution.
   *
   * @param {UnsubscribeFromCandlesParams} params - The parameters for unsubscribing from the candle updates.
   */
  unsubscribeFromCandles(params: UnsubscribeFromCandlesParams): void {
    this.hanjiWebSocketService.unsubscribeFromCandles(params);
  }

  [Symbol.dispose](): void {
    this.detachEvents();
    this.hanjiWebSocketService[Symbol.dispose]();
  }

  protected async ensureMarketInfo(params: { market: string }): Promise<MarketInfo> {
    const marketInfo = await this.getMarketInfo(params);
    if (!marketInfo)
      throw new Error(`Market not found by the ${params.market} address`);

    return marketInfo;
  }

  protected async getSpotMarketContract(params: { market: string }): Promise<HanjiSpotMarketContract> {
    if (this.signerOrProvider === null) {
      throw new Error('Signer or provider is not set');
    }
    let marketContract = this.marketContracts.get(params.market);

    if (!marketContract) {
      const marketInfo = await this.ensureMarketInfo(params);

      marketContract = new HanjiSpotMarketContract({
        marketInfo,
        signerOrProvider: this.signerOrProvider,
        transferExecutedTokensEnabled: this.transferExecutedTokensEnabled,
        autoWaitTransaction: this.autoWaitTransaction,
      });
      this.marketContracts.set(params.market, marketContract);
    }

    return marketContract;
  }

  protected attachEvents(): void {
    this.hanjiWebSocketService.events.marketUpdated.addListener(this.onMarketUpdated);
    this.hanjiWebSocketService.events.orderbookUpdated.addListener(this.onOrderbookUpdated);
    this.hanjiWebSocketService.events.tradesUpdated.addListener(this.onTradesUpdated);
    this.hanjiWebSocketService.events.userOrdersUpdated.addListener(this.onUserOrdersUpdated);
    this.hanjiWebSocketService.events.userFillsUpdated.addListener(this.onUserFillsUpdated);
    this.hanjiWebSocketService.events.candlesUpdated.addListener(this.onCandlesUpdated);
    this.hanjiWebSocketService.events.subscriptionError.addListener(this.onSubscriptionError);
  }

  protected detachEvents(): void {
    this.hanjiWebSocketService.events.marketUpdated.removeListener(this.onMarketUpdated);
    this.hanjiWebSocketService.events.orderbookUpdated.removeListener(this.onOrderbookUpdated);
    this.hanjiWebSocketService.events.tradesUpdated.removeListener(this.onTradesUpdated);
    this.hanjiWebSocketService.events.userOrdersUpdated.removeListener(this.onUserOrdersUpdated);
    this.hanjiWebSocketService.events.userFillsUpdated.removeListener(this.onUserFillsUpdated);
    this.hanjiWebSocketService.events.candlesUpdated.removeListener(this.onCandlesUpdated);
    this.hanjiWebSocketService.events.subscriptionError.removeListener(this.onSubscriptionError);
  }

  protected getScalingFactors(baseToken: Token, quoteToken: Token): MarketInfo['scalingFactors'] {
    return {
      baseToken: baseToken.scalingFactor,
      quoteToken: quoteToken.scalingFactor,
      price: quoteToken.scalingFactor - baseToken.scalingFactor,
    };
  }

  protected onMarketUpdated: Parameters<typeof this.hanjiWebSocketService.events.marketUpdated['addListener']>[0] = async (marketId, data) => {
    try {
      const marketInfo = await this.getMarketInfo({ market: marketId });
      if (!marketInfo)
        return;
      const marketUpdate = this.mappers.mapMarketUpdateDtoToMarketUpdate(marketId, data, marketInfo.scalingFactors.price);

      (this.events.marketUpdated as ToEventEmitter<typeof this.events.marketUpdated>).emit(marketId, marketUpdate);
    }
    catch (error) {
      console.error(getErrorLogMessage(error));
    }
  };

  protected onOrderbookUpdated: Parameters<typeof this.hanjiWebSocketService.events.orderbookUpdated['addListener']>[0] = async (marketId, data) => {
    try {
      const marketInfo = await this.getMarketInfo({ market: marketId });
      if (!marketInfo)
        return;
      const orderbookUpdate = this.mappers.mapOrderbookUpdateDtoToOrderbookUpdate(marketId, data, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken);

      (this.events.orderbookUpdated as ToEventEmitter<typeof this.events.orderbookUpdated>).emit(marketId, orderbookUpdate);
    }
    catch (error) {
      console.error(getErrorLogMessage(error));
    }
  };

  protected onTradesUpdated: Parameters<typeof this.hanjiWebSocketService.events.tradesUpdated['addListener']>[0] = async (marketId, data) => {
    try {
      const marketInfo = await this.getMarketInfo({ market: marketId });
      if (!marketInfo)
        return;
      const tradeUpdates = data.map(dto => this.mappers.mapTradeUpdateDtoToTradeUpdate(marketId, dto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

      (this.events.tradesUpdated as ToEventEmitter<typeof this.events.tradesUpdated>).emit(marketId, tradeUpdates);
    }
    catch (error) {
      console.error(getErrorLogMessage(error));
    }
  };

  protected onUserOrdersUpdated: Parameters<typeof this.hanjiWebSocketService.events.userOrdersUpdated['addListener']>[0] = async (marketId, data) => {
    try {
      const marketInfo = await this.getMarketInfo({ market: marketId });
      if (!marketInfo)
        return;
      const orderUpdates = data.map(dto => this.mappers.mapOrderUpdateDtoToOrderUpdate(marketId, dto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

      (this.events.userOrdersUpdated as ToEventEmitter<typeof this.events.userOrdersUpdated>).emit(marketId, orderUpdates);
    }
    catch (error) {
      console.error(getErrorLogMessage(error));
    }
  };

  protected onUserFillsUpdated: Parameters<typeof this.hanjiWebSocketService.events.userFillsUpdated['addListener']>[0] = async (marketId, data) => {
    try {
      const marketInfo = await this.getMarketInfo({ market: marketId });
      if (!marketInfo)
        return;
      const fillUpdates = data.map(dto => this.mappers.mapFillUpdateDtoToFillUpdate(marketId, dto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

      (this.events.userFillsUpdated as ToEventEmitter<typeof this.events.userFillsUpdated>).emit(marketId, fillUpdates);
    }
    catch (error) {
      console.error(getErrorLogMessage(error));
    }
  };

  protected onCandlesUpdated: Parameters<typeof this.hanjiWebSocketService.events.candlesUpdated['addListener']>[0] = (marketId, data) => {
    (this.events.candlesUpdated as ToEventEmitter<typeof this.events.candlesUpdated>).emit(marketId, data);
  };

  protected onSubscriptionError: Parameters<typeof this.hanjiWebSocketService.events.subscriptionError['addListener']>[0] = error => {
    (this.events.subscriptionError as ToEventEmitter<typeof this.events.subscriptionError>).emit(error);
  };
}
