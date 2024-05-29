import type { FillDto, MarketDto, OrderDto, OrderbookDto, TokenDto, TradeDto } from './dtos';
import type { GetFillsParams, GetMarketsParams, GetOrderbookParams, GetOrdersParams, GetTokensParams, GetTradesParams } from './params';
import { guards } from '../../utils';
import { RemoteService } from '../remoteService';

export class HanjiService extends RemoteService {
  async getOrderbook(params: GetOrderbookParams): Promise<OrderbookDto> {
    const queryParams = new URLSearchParams({
      market: params.market
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());
    if (params.aggregation)
      queryParams.append('aggregation', params.aggregation.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<OrderbookDto>(`/orderbook/${queryParamsString}`, 'json');

    return response;
  }

  async getOrders(params: GetOrdersParams): Promise<OrderDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market,
      user: params.user
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
    const response = await this.fetch<OrderDto[]>(`/orders/${queryParamsString}`, 'json');

    return response;
  }

  async getTrades(params: GetTradesParams): Promise<TradeDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<TradeDto[]>(`/trades/${queryParamsString}`, 'json');

    return response;
  }

  async getFills(params: GetFillsParams): Promise<FillDto[]> {
    const queryParams = new URLSearchParams({
      market: params.market,
      user: params.user
    });
    if (params.limit)
      queryParams.append('limit', params.limit.toString());

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<FillDto[]>(`/fills/${queryParamsString}`, 'json');

    return response;
  }

  async getTokens(params: GetTokensParams): Promise<TokenDto[]> {
    const queryParams = new URLSearchParams();
    if (params.token)
      queryParams.append('token', params.token);

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<TokenDto[]>(`/tokens/${queryParamsString}`, 'json');

    return response;
  }

  async getMarkets(params: GetMarketsParams): Promise<MarketDto[]> {
    const queryParams = new URLSearchParams();
    if (params.market)
      queryParams.append('market', params.market);

    const queryParamsString = decodeURIComponent(queryParams.toString());
    const response = await this.fetch<MarketDto[]>(`/markets/${queryParamsString}`, 'json');

    return response;
  }
}
