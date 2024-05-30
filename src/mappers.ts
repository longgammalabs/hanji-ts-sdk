import { Market } from './models';
import { MarketDto } from './services/hanjiSpotService';

export const marketDtoToMarket = (dto: MarketDto): Market => {
  return dto;
};
