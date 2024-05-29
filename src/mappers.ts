import { Market } from './models';
import { MarketDto } from './services/hanjiService';

export const marketDtoToMarket = (dto: MarketDto): Market => {
  return dto;
};
