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
  WithdrawSpotParams
} from './params';
import { EventEmitter, type PublicEventEmitter, type ToEventEmitter } from '../common';
import { getErrorLogMessage } from '../logging';
import type { Market, FillUpdate, MarketUpdate, OrderUpdate, OrderbookUpdate, TradeUpdate, Orderbook, Order, Trade, Fill, Token, MarketInfo } from '../models';
import { HanjiSpotService, HanjiSpotWebSocketService } from '../services';

export interface HanjiSpotOptions {
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
  singerOrProvider: Signer | Provider;
  webSocketConnectImmediately?: boolean;
  transferExecutedTokensEnabled?: boolean;
  autoWaitTransaction?: boolean;
}

interface HanjiSpotEvents {
  marketUpdated: PublicEventEmitter<readonly [marketId: string, data: MarketUpdate]>;
  orderbookUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderbookUpdate]>;
  tradesUpdated: PublicEventEmitter<readonly [marketId: string, data: TradeUpdate[]]>;
  userOrdersUpdated: PublicEventEmitter<readonly [marketId: string, data: OrderUpdate[]]>;
  userFillsUpdated: PublicEventEmitter<readonly [marketId: string, data: FillUpdate[]]>;
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

export class HanjiSpot implements Disposable {
  readonly events: HanjiSpotEvents = {
    subscriptionError: new EventEmitter(),
    marketUpdated: new EventEmitter(),
    orderbookUpdated: new EventEmitter(),
    tradesUpdated: new EventEmitter(),
    userOrdersUpdated: new EventEmitter(),
    userFillsUpdated: new EventEmitter(),
  };

  transferExecutedTokensEnabled: boolean | undefined;
  autoWaitTransaction: boolean | undefined;

  protected readonly signerOrProvider: Signer | Provider;
  protected readonly hanjiService: HanjiSpotService;
  protected readonly hanjiWebSocketService: HanjiSpotWebSocketService;
  protected readonly marketContracts: Map<string, HanjiSpotMarketContract> = new Map();
  protected readonly marketInfos: Map<string, MarketInfo> = new Map();
  protected readonly mappers: typeof mappers;
  private readonly marketInfoPromises: Map<string, Promise<Market[]>> = new Map();

  constructor(options: Readonly<HanjiSpotOptions>) {
    this.signerOrProvider = options.singerOrProvider;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction;
    this.hanjiService = new HanjiSpotService(options.apiBaseUrl);
    this.hanjiWebSocketService = new HanjiSpotWebSocketService(options.webSocketApiBaseUrl, options.webSocketConnectImmediately);
    this.mappers = mappers;

    this.attachEvents();
  }

  async approveTokens(params: ApproveSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.approveTokens(params);
  }

  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.depositTokens(params);
  }

  async withdrawTokens(params: WithdrawSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.withdrawTokens(params);
  }

  async setClaimableStatus(params: SetClaimableStatusParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.setClaimableStatus(params);
  }

  async placeOrder(params: PlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.placeOrder(params);
  }

  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchPlaceOrder(params);
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.claimOrder(params);
  }

  async batchClaim(params: BatchClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchClaim(params);
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.changeOrder(params);
  }

  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchChangeOrder(params);
  }

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

  async getMarkets(params: GetMarketsParams): Promise<Market[]> {
    const marketDtos = await this.hanjiService.getMarkets(params);
    const markets = marketDtos.map(marketDto => this.mappers.mapMarketDtoToMarket(
      marketDto,
      this.getScalingFactors(marketDto.baseToken, marketDto.quoteToken).price
    ));

    return markets;
  }

  async getTokens(params: GetTokensParams): Promise<Token[]> {
    const tokenDtos = await this.hanjiService.getTokens(params);
    const tokens = tokenDtos.map(this.mappers.mapTokenDtoToToken);

    return tokens;
  }

  async getOrderbook(params: GetOrderbookParams): Promise<Orderbook> {
    const [marketInfo, orderbookDto] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getOrderbook(params),
    ]);
    const orderbook = this.mappers.mapOrderbookDtoToOrderbook(orderbookDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken);

    return orderbook;
  }

  async getOrders(params: GetOrdersParams): Promise<Order[]> {
    const [marketInfo, orderDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getOrders(params),
    ]);
    const orders = orderDtos.map(orderDto => this.mappers.mapOrderDtoToOrder(orderDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return orders;
  }

  async getTrades(params: GetTradesParams): Promise<Trade[]> {
    const [marketInfo, tradeDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getTrades(params),
    ]);
    const trades = tradeDtos.map(tradeDto => this.mappers.mapTradeDtoToTrade(tradeDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return trades;
  }

  async getFills(params: GetFillsParams): Promise<Fill[]> {
    const [marketInfo, fillDtos] = await Promise.all([
      this.ensureMarketInfo(params),
      this.hanjiService.getFills(params),
    ]);
    const fills = fillDtos.map(fillDto => this.mappers.mapFillDtoToFill(fillDto, marketInfo.scalingFactors.price, marketInfo.scalingFactors.baseToken));

    return fills;
  }

  subscribeToMarket(params: SubscribeToMarketParams): void {
    this.hanjiWebSocketService.subscribeToMarket(params);
  }

  unsubscribeFromMarket(params: UnsubscribeFromMarketParams): void {
    this.hanjiWebSocketService.unsubscribeFromMarket(params);
  }

  subscribeToOrderbook(params: SubscribeToOrderbookParams): void {
    this.hanjiWebSocketService.subscribeToOrderbook(params);
  }

  unsubscribeFromOrderbook(params: UnsubscribeFromOrderbookParams): void {
    this.hanjiWebSocketService.unsubscribeFromOrderbook(params);
  }

  subscribeToTrades(params: SubscribeToTradesParams): void {
    this.hanjiWebSocketService.subscribeToTrades(params);
  }

  unsubscribeFromTrades(params: UnsubscribeFromTradesParams): void {
    this.hanjiWebSocketService.unsubscribeFromTrades(params);
  }

  subscribeToUserOrders(params: SubscribeToUserOrdersParams): void {
    this.hanjiWebSocketService.subscribeToUserOrders(params);
  }

  unsubscribeFromUserOrders(params: UnsubscribeFromUserOrdersParams): void {
    this.hanjiWebSocketService.unsubscribeFromUserOrders(params);
  }

  subscribeToUserFills(params: SubscribeToUserFillsParams): void {
    this.hanjiWebSocketService.subscribeToUserFills(params);
  }

  unsubscribeFromUserFills(params: UnsubscribeFromUserFillsParams): void {
    this.hanjiWebSocketService.unsubscribeFromUserFills(params);
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
    this.hanjiWebSocketService.events.subscriptionError.addListener(this.onSubscriptionError);
  }

  protected detachEvents(): void {
    this.hanjiWebSocketService.events.marketUpdated.removeListener(this.onMarketUpdated);
    this.hanjiWebSocketService.events.orderbookUpdated.removeListener(this.onOrderbookUpdated);
    this.hanjiWebSocketService.events.tradesUpdated.removeListener(this.onTradesUpdated);
    this.hanjiWebSocketService.events.userOrdersUpdated.removeListener(this.onUserOrdersUpdated);
    this.hanjiWebSocketService.events.userFillsUpdated.removeListener(this.onUserFillsUpdated);
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

  protected onSubscriptionError: Parameters<typeof this.hanjiWebSocketService.events.subscriptionError['addListener']>[0] = error => {
    (this.events.subscriptionError as ToEventEmitter<typeof this.events.subscriptionError>).emit(error);
  };
}
