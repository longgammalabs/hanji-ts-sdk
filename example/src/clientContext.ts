import { createContext } from 'react';
import { HanjiClient } from 'hanji-ts-sdk';
import { HANJI_API_BASE_URL, HANJI_WEBSOCKET_BASE_URL } from './constants';

export const defaultHanjiClient = new HanjiClient({
  apiBaseUrl: HANJI_API_BASE_URL,
  webSocketApiBaseUrl: HANJI_WEBSOCKET_BASE_URL,
  signer: null,
  webSocketConnectImmediately: false,
  autoWaitTransaction: false,
});
export const HanjiClientContext = createContext<HanjiClient>(defaultHanjiClient);
export const ClientAddressContext = createContext<string | null>(null);
