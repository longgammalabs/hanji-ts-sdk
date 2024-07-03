/**
 * A base class for all errors thrown by the Hanji TypeScript SDK.
 *
 * @class HanjiError
 * @extends Error
 */
export abstract class HanjiError extends Error {
  readonly name: string;

  /**
   * Creates a new HanjiError.
   *
   * @param {string} [message] - The error message.
   * @param {ErrorOptions} [options] - The error options.
   */
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);

    this.name = this.constructor.name;
  }
}
