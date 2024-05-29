export abstract class HanjiError extends Error {
  readonly name: string;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);

    this.name = this.constructor.name;
  }
}
