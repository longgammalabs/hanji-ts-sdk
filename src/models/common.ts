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

  /**
   * Indicates whether the token is ERC20Permit compatible.
   */
  supportsPermit: boolean;

  /**
   * Image url for icon
   */
  iconUrl: string | null;

  /**
   * Indicates if token is mem-token from Organic Growth
   */
  fromOg: boolean;
}

export type TokenUpdate = Token;

export type TokenType = 'base' | 'quote';
