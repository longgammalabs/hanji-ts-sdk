import type { CandleDto, FillDto, MarketDto, OrderDto, OrderbookDto, TokenDto, TradeDto } from './dtos';
import type { GetCandlesParams, GetFillsParams, GetMarketsParams, GetOrderbookParams, GetOrdersParams, GetTokensParams, GetTradesParams } from './params';
import { guards } from '../../utils';
import { RemoteService } from '../remoteService';

/**
 * HanjiSpotService provides methods to interact with the Hanji spot market API.
 * It extends the RemoteService class to leverage common remote service functionalities.
 */
export class HanjiSpotService extends RemoteService {
  /**
   * Retrieves the orderbook for a given market.
   * @param params - The parameters for the orderbook request.
   * @returns The orderbook data.
   */
  async getOrderbook(params: GetOrderbookParams): Promise<OrderbookDto> {
    const queryParams = new URLSearchParams({
      market: params.market,
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());
    if (params.aggregation)
      queryParams.append('aggregation', params.aggregation.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<OrderbookDto>(`/orderbook?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the orders for a given market.
   * @param params - The parameters for the orders request.
   * @returns The orders data.
   */
  async getOrders(params: GetOrdersParams): Promise<OrderDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market,
      user: params.user,
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());
    if (params.status) {
      if (guards.isArray(params.status))
        params.status.forEach(status => queryParams.append('status', status.toString()));
      else
        queryParams.append('status', params.status.toString());
    }

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<OrderDto[]>(`/orders?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the trades for a given market.
   * @param params - The parameters for the trades request.
   * @returns The trades data.
   */
  async getTrades(params: GetTradesParams): Promise<TradeDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market,
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<TradeDto[]>(`/trades?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the fills for a given market.
   * @param params - The parameters for the fills request.
   * @returns The fills data.
   */
  async getFills(params: GetFillsParams): Promise<FillDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market,
      user: params.user,
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<FillDto[]>(`/fills?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the tokens for a given market.
   * @param params - The parameters for the tokens request.
   * @returns The tokens data.
   */
  async getTokens(params: GetTokensParams): Promise<TokenDto[]> {
    const queryParams = new URLSearchParams();
    if (params.token)
      queryParams.append('token', params.token);

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<TokenDto[]>(`/tokens?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the markets for a given market.
   * @param params - The parameters for the markets request.
   * @returns The markets data.
   */
  async getMarkets(params: GetMarketsParams): Promise<MarketDto[]> {
    const queryParams = new URLSearchParams();
    if (params.market)
      queryParams.append('market', params.market);

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<MarketDto[]>(`/markets?${queryParamsString}`, 'json');

    return response;
  }

  /**
   * Retrieves the candle data for a given market.
   * @param params - The parameters for the candles request.
   * @returns The candle data.
   */
  async getCandles(params: GetCandlesParams): Promise<CandleDto[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('market', params.market);
    queryParams.append('resolution', params.resolution);
    if (params.fromTime)
      queryParams.append('fromTime', params.fromTime.toString());
    if (params.toTime)
      queryParams.append('toTime', params.toTime.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<CandleDto[]>(`/candles?${queryParamsString}`, 'json');

    return response;
  }
}
