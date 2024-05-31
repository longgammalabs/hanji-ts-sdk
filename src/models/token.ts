export interface Token {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  scalingFactor: number;
  decimals: number;
  roundingDecimals: number;
}

export type TokenUpdate = Token;
