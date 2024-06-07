import type {
  Token,
  Market,
  OrderbookLevel,
  Orderbook,
  Trade,
  MarketUpdate,
  OrderbookUpdate,
  TradeUpdate,
  OrderUpdate,
  FillUpdate,
  Fill,
} from '../models';
import type {
  TokenDto,
  MarketDto,
  OrderbookLevelDto,
  OrderbookDto,
  TradeDto,
  FillDto,
} from '../services/hanjiSpotService';
import type {
  FillUpdateDto,
  MarketUpdateDto,
  OrderUpdateDto,
  OrderbookUpdateDto,
  TradeUpdateDto
} from '../services/hanjiSpotWebSocketService/dtos';
import { tokenUtils } from '../utils';

export const mapTokenDtoToToken = (dto: TokenDto): Token => {
  return dto;
};

export const mapMarketDtoToMarket = (dto: MarketDto, priceFactor: number): Market => {
  return {
    ...dto,
    rawLastPrice: dto.lastPrice ? BigInt(dto.lastPrice) : null,
    lastPrice: dto.lastPrice ? tokenUtils.convertTokensRawAmountToAmount(dto.lastPrice, priceFactor) : null,
    rawLowPrice24h: dto.lowPrice24h ? BigInt(dto.lowPrice24h) : null,
    lowPrice24h: dto.lowPrice24h ? tokenUtils.convertTokensRawAmountToAmount(dto.lowPrice24h, priceFactor) : null,
    rawHighPrice24h: dto.highPrice24h ? BigInt(dto.highPrice24h) : null,
    highPrice24h: dto.highPrice24h ? tokenUtils.convertTokensRawAmountToAmount(dto.highPrice24h, priceFactor) : null
  };
};

const mapOrderbookLevelDtoToOrderbookLevel = (dto: OrderbookLevelDto, priceFactor: number, sizeFactor: number): OrderbookLevel => {
  return {
    rawPrice: BigInt(dto.price),
    price: tokenUtils.convertTokensRawAmountToAmount(dto.price, priceFactor),
    rawSize: BigInt(dto.size),
    size: tokenUtils.convertTokensRawAmountToAmount(dto.size, sizeFactor),
  };
};

export const mapOrderbookDtoToOrderbook = (dto: OrderbookDto, priceFactor: number, sizeFactor: number): Orderbook => {
  const asks = dto.levels.asks.map(ask => mapOrderbookLevelDtoToOrderbookLevel(ask, priceFactor, sizeFactor));
  const bids = dto.levels.bids.map(bid => mapOrderbookLevelDtoToOrderbookLevel(bid, priceFactor, sizeFactor));

  return {
    ...dto,
    levels: {
      asks,
      bids
    }
  };
};

export const mapTradeDtoToTrade = (dto: TradeDto, priceFactor: number, sizeFactor: number): Trade => {
  return {
    ...dto,
    rawPrice: BigInt(dto.price),
    price: tokenUtils.convertTokensRawAmountToAmount(dto.price, priceFactor),
    rawSize: BigInt(dto.size),
    size: tokenUtils.convertTokensRawAmountToAmount(dto.size, sizeFactor)
  };
};

export const mapOrderDtoToOrder = (dto: OrderUpdateDto, priceFactor: number, sizeFactor: number): OrderUpdate => {
  return {
    ...dto,
    rawPrice: BigInt(dto.price),
    price: tokenUtils.convertTokensRawAmountToAmount(dto.price, priceFactor),
    rawSize: BigInt(dto.size),
    size: tokenUtils.convertTokensRawAmountToAmount(dto.size, sizeFactor),
    rawOrigSize: BigInt(dto.origSize),
    origSize: tokenUtils.convertTokensRawAmountToAmount(dto.origSize, sizeFactor),
    rawClaimed: BigInt(dto.claimed),
    claimed: tokenUtils.convertTokensRawAmountToAmount(dto.claimed, sizeFactor),
  };
};

export const mapFillDtoToFill = (dto: FillDto, priceFactor: number, sizeFactor: number): Fill => {
  return {
    ...dto,
    rawPrice: BigInt(dto.price),
    price: tokenUtils.convertTokensRawAmountToAmount(dto.price, priceFactor),
    rawSize: BigInt(dto.size),
    size: tokenUtils.convertTokensRawAmountToAmount(dto.size, sizeFactor)
  };
};

export const mapMarketUpdateDtoToMarketUpdate = (
  _marketId: string,
  dto: MarketUpdateDto,
  priceFactor: number
): MarketUpdate => mapMarketDtoToMarket(dto, priceFactor);

export const mapOrderbookUpdateDtoToOrderbookUpdate = (
  _marketId: string,
  dto: OrderbookUpdateDto,
  priceFactor: number,
  sizeFactor: number
): OrderbookUpdate => mapOrderbookDtoToOrderbook(dto, priceFactor, sizeFactor);

export const mapTradeUpdateDtoToTradeUpdate = (
  _marketId: string,
  dto: TradeUpdateDto,
  priceFactor: number,
  sizeFactor: number
): TradeUpdate => mapTradeDtoToTrade(dto, priceFactor, sizeFactor);

export const mapOrderUpdateDtoToOrderUpdate = (
  _marketId: string,
  dto: OrderUpdateDto,
  priceFactor: number,
  sizeFactor: number
): OrderUpdate => mapOrderDtoToOrder(dto, priceFactor, sizeFactor);

export const mapFillUpdateDtoToFillUpdate = (
  _marketId: string,
  dto: FillUpdateDto,
  priceFactor: number,
  sizeFactor: number
): FillUpdate => mapFillDtoToFill(dto, priceFactor, sizeFactor);
