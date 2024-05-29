import type { Provider, Signer } from 'ethers/providers';

import { HanjiSpotClient } from './hanjiSpotClient';
import type { ClaimOrderParams, DepositParams, PlaceOrderParams, WithdrawParams } from './params';
import * as mappers from '../mappers';
import { Market } from '../models';
import { HanjiSpotService } from '../services';

export interface HanjiClientOptions {
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
  singerOrProvider: Signer | Provider;
}

export class HanjiClient {
  private readonly hanjiService: HanjiSpotService;
  private readonly marketClients: Map<string, HanjiSpotClient> = new Map();

  constructor(private readonly options: Readonly<HanjiClientOptions>) {
    this.hanjiService = new HanjiSpotService(options.apiBaseUrl);
  }

  async getSpotClient(marketContractAddress: string): Promise<HanjiSpotClient> {
    let marketClient = this.marketClients.get(marketContractAddress);

    if (!marketClient) {
      const market = await this.fetchMarket(marketContractAddress);
      if (!market)
        throw new Error(`Market not found by the ${marketContractAddress} address`);

      marketClient = new HanjiSpotClient({
        hanjiService: this.hanjiService,
        singerOrProvider: this.options.singerOrProvider,

        name: market.name,
        marketContractAddress: market.orderbookAddress,
        baseToken: market.baseToken,
        quoteToken: market.quoteToken,
      });
      this.marketClients.set(marketContractAddress, marketClient);
    }

    return marketClient;
  }

  async deposit(marketContractAddress: string, params: DepositParams): Promise<string> {
    const market = await this.getSpotClient(marketContractAddress);

    return market.deposit(params);
  }

  async withdraw(marketContractAddress: string, params: WithdrawParams): Promise<string> {
    const market = await this.getSpotClient(marketContractAddress);

    return market.withdraw(params);
  }

  async placeOrder(marketContractAddress: string, params: PlaceOrderParams): Promise<string> {
    const market = await this.getSpotClient(marketContractAddress);

    return market.placeOrder(params);
  }

  async claimOrder(marketContractAddress: string, params: ClaimOrderParams): Promise<string> {
    const market = await this.getSpotClient(marketContractAddress);

    return market.claimOrder(params);
  }

  private async fetchMarket(marketContractAddress: string): Promise<Market | undefined> {
    try {
      const marketDtos = await this.hanjiService.getMarkets({ market: marketContractAddress });
      if (!marketDtos[0])
        return undefined;

      const market = mappers.marketDtoToMarket(marketDtos[0]);
      return market;
    }
    catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
