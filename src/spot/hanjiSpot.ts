import type { Provider, Signer } from 'ethers/providers';

import { HanjiSpotMarketContract } from './hanjiSpotMarketContract';
import type {
  ApproveSpotParams,
  BatchChangeOrderSpotParams,
  BatchClaimOrderSpotParams,
  BatchPlaceOrderSpotParams,
  ChangeOrderSpotParams,
  ClaimOrderSpotParams,
  DepositSpotParams,
  GetFillsParams,
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
import { type PublicEventEmitter } from '../common';
import type { Market, FillUpdate, MarketUpdate, OrderUpdate, OrderbookUpdate, TradeUpdate, Orderbook, Order, Trade, Fill, Token } from '../models';
import { HanjiSpotService, HanjiSpotWebSocketService } from '../services';

export interface HanjiSpotOptions {
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
  singerOrProvider: Signer | Provider;
  webSocketConnectImmediately?: boolean;
}

interface HanjiSpotEvents {
  marketUpdated: PublicEventEmitter<readonly [market: string, data: MarketUpdate]>;
  orderbookUpdated: PublicEventEmitter<readonly [market: string, data: OrderbookUpdate]>;
  tradesUpdated: PublicEventEmitter<readonly [market: string, data: TradeUpdate[]]>;
  userOrdersUpdated: PublicEventEmitter<readonly [market: string, data: OrderUpdate[]]>;
  userFillsUpdated: PublicEventEmitter<readonly [market: string, data: FillUpdate[]]>;
  subscriptionError: PublicEventEmitter<readonly [error: string]>;
}

export class HanjiSpot {
  readonly events: HanjiSpotEvents;

  protected readonly signerOrProvider: Signer | Provider;
  protected readonly hanjiService: HanjiSpotService;
  protected readonly hanjiWebSocketService: HanjiSpotWebSocketService;
  protected readonly markets: Map<string, HanjiSpotMarketContract> = new Map();

  constructor(options: Readonly<HanjiSpotOptions>) {
    this.signerOrProvider = options.singerOrProvider;
    this.hanjiService = new HanjiSpotService(options.apiBaseUrl);
    this.hanjiWebSocketService = new HanjiSpotWebSocketService(options.webSocketApiBaseUrl, options.webSocketConnectImmediately);

    this.events = this.hanjiWebSocketService.events;
  }

  async approveTokens(params: ApproveSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.approveTokens(params);
  }

  async depositTokens(params: DepositSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.depositTokens(params);
  }

  async withdrawTokens(params: WithdrawSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.withdrawTokens(params);
  }

  async setClaimableStatus(params: SetClaimableStatusParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.setClaimableStatus(params);
  }

  async placeOrder(params: PlaceOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.placeOrder(params);
  }

  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchPlaceOrder(params);
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.claimOrder(params);
  }

  async batchClaim(params: BatchClaimOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchClaim(params);
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.changeOrder(params);
  }

  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<string> {
    const marketContract = await this.getSpotMarketContract(params);

    return marketContract.batchChangeOrder(params);
  }

  async getMarkets(params: GetMarketsParams): Promise<Market[]> {
    const marketDtos = await this.hanjiService.getMarkets(params);
    return marketDtos;
  }

  async getTokens(params: GetTokensParams): Promise<Token[]> {
    const tokenDtos = await this.hanjiService.getTokens(params);
    return tokenDtos;
  }

  async getOrderbook(params: GetOrderbookParams): Promise<Orderbook> {
    const orderbookDto = await this.hanjiService.getOrderbook(params);

    return orderbookDto;
  }

  async getOrders(params: GetOrdersParams): Promise<Order[]> {
    const orderDtos = await this.hanjiService.getOrders(params);
    return orderDtos;
  }

  async getTrades(params: GetTradesParams): Promise<Trade[]> {
    const tradeDtos = await this.hanjiService.getTrades(params);
    return tradeDtos;
  }

  async getFills(params: GetFillsParams): Promise<Fill[]> {
    const fillDtos = await this.hanjiService.getFills(params);
    return fillDtos;
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

  protected async getSpotMarketContract(params: { market: string }): Promise<HanjiSpotMarketContract> {
    let marketContract = this.markets.get(params.market);

    if (!marketContract) {
      let market: Market | undefined;
      try {
        const markets = await this.getMarkets(params);
        market = markets[0];
      }
      catch (error) {
        console.error(error);
      }
      if (!market)
        throw new Error(`Market not found by the ${params.market} address`);

      marketContract = new HanjiSpotMarketContract({
        name: market.name,
        marketContractAddress: market.orderbookAddress,
        baseToken: market.baseToken,
        quoteToken: market.quoteToken,
        signerOrProvider: this.signerOrProvider,

      });
      this.markets.set(params.market, marketContract);
    }

    return marketContract;
  }
}
