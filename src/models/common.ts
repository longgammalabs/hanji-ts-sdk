/**
 * Represents a cryptocurrency token.
 */
export interface Token {
  /**
   * Unique identifier for the token.
   */
  id: string;

  /**
   * Name of the token.
   */
  name: string;

  /**
   * Symbol of the token.
   */
  symbol: string;

  /**
   * Contract address of the token.
   */
  contractAddress: string;

  /**
   * Number of decimals ignored for the token in markets.
   * E.g. for X amount of token, the operating amount in the market contract is `X / 10^scalingFactor`.
   */
  scalingFactor: number;

  /**
   * Number of decimals the token uses.
   */
  decimals: number;

  /**
   * Number of rounding decimals for the token.
   */
  roundingDecimals: number;
}

export type TokenUpdate = Token;
