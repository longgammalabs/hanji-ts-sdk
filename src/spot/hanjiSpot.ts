import type { Provider, Signer } from 'ethers/providers';

import { HanjiSpotMarket } from './hanjiSpotMarket';
import type { ClaimOrderSpotParams, DepositSpotParams, PlaceOrderSpotParams, WithdrawSpotParams } from './params';
import * as mappers from '../mappers';
import { Market } from '../models';
import { HanjiSpotService } from '../services';

export interface HanjiSpotOptions {
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
  singerOrProvider: Signer | Provider;
}

export class HanjiSpot {
  private readonly hanjiService: HanjiSpotService;
  private readonly markets: Map<string, HanjiSpotMarket> = new Map();

  constructor(private readonly options: Readonly<HanjiSpotOptions>) {
    this.hanjiService = new HanjiSpotService(options.apiBaseUrl);
  }

  async getMarket(marketContractAddress: string): Promise<HanjiSpotMarket> {
    let marketClient = this.markets.get(marketContractAddress);

    if (!marketClient) {
      const market = await this.fetchMarket(marketContractAddress);
      if (!market)
        throw new Error(`Market not found by the ${marketContractAddress} address`);

      marketClient = new HanjiSpotMarket({
        hanjiService: this.hanjiService,
        singerOrProvider: this.options.singerOrProvider,

        name: market.name,
        marketContractAddress: market.orderbookAddress,
        baseToken: market.baseToken,
        quoteToken: market.quoteToken,
      });
      this.markets.set(marketContractAddress, marketClient);
    }

    return marketClient;
  }

  async deposit(marketContractAddress: string, params: DepositSpotParams): Promise<string> {
    const market = await this.getMarket(marketContractAddress);

    return market.deposit(params);
  }

  async withdraw(marketContractAddress: string, params: WithdrawSpotParams): Promise<string> {
    const market = await this.getMarket(marketContractAddress);

    return market.withdraw(params);
  }

  async placeOrder(marketContractAddress: string, params: PlaceOrderSpotParams): Promise<string> {
    const market = await this.getMarket(marketContractAddress);

    return market.placeOrder(params);
  }

  async claimOrder(marketContractAddress: string, params: ClaimOrderSpotParams): Promise<string> {
    const market = await this.getMarket(marketContractAddress);

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
