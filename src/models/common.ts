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
   * Number of decimals the token uses.
   */
  decimals: number;

  /**
   * Number of rounding decimals for the token.
   */
  roundingDecimals: number;
}

export type TokenUpdate = Token;

export type TokenType = 'base' | 'quote';
