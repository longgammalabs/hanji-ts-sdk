import type { Provider, Signer } from 'ethers/providers';

import { HanjiSpot } from './spot';

export interface HanjiClientOptions {
  apiBaseUrl: string;
  webSocketApiBaseUrl: string;
  singerOrProvider: Signer | Provider;
}

export class HanjiClient {
  readonly spot: HanjiSpot;

  constructor(options: Readonly<HanjiClientOptions>) {
    this.spot = new HanjiSpot(options);
  }
}
