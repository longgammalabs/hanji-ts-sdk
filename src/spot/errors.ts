import type { ErrorDescription } from 'ethers';

import { HanjiError } from '../common';

export class TransactionFailedError extends HanjiError {

  constructor(
    readonly encodedError: string,
    readonly error: ErrorDescription | null,
    options?: ErrorOptions
  ) {
    super(`Error: ${error ? `${error.name} [${error.selector}]` : `Unknown error: [${encodedError}]`}`, options);
  }
}
