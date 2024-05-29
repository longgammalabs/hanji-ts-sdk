export interface TestConfig {
  readonly rpcUrl: string;
  readonly chainId: number;
  readonly accountPrivateKey: string;
  readonly hanjiApiBaseUrl: string;
  readonly hanjiWebsocketBaseUrl: string;
}

const envInfos = [
  ['RPC_URL', 'the RPC URL for EVM node'],
  ['CHAIN_ID', 'chain ID of the EVM network'],
  ['ACCOUNT_PRIVATE_KEY', 'the private key of the test account'],
  ['HANJI_API_BASE_URL', 'the base URL for Hanji API'],
  ['HANJI_WEBSOCKET_BASE_URL', 'the base URL for Hanji Websocket']
] as const;

const validateRequiredEnvironmentVariables = (): [true, typeof process.env & Record<typeof envInfos[number][0], string>] | [false, string[]] => {
  const errors: string[] = [];
  for (const [name, description] of envInfos) {
    if (!process.env[name])
      errors.push(`Please, specify \x1b[34m${name}\x1b[0m - ${description}`);
  }

  return errors.length ? [false, errors] : [true, process.env as any];
};

const createInvalidEnvironmentVariablesError = (errors: string[]): Error =>
  new Error(errors.reduce(
    (acc, error, index) => `  ${acc}${index + 1}. ${error}\n`,
    '\nSome required environment variables are invalid:\n'
  ));

export const getTestConfig = (): TestConfig => {
  const [isValid, env] = validateRequiredEnvironmentVariables();
  if (!isValid)
    throw createInvalidEnvironmentVariablesError(env);

  return {
    rpcUrl: env.RPC_URL,
    chainId: Number.parseInt(env.CHAIN_ID),
    accountPrivateKey: env.ACCOUNT_PRIVATE_KEY,
    hanjiApiBaseUrl: env.HANJI_API_BASE_URL,
    hanjiWebsocketBaseUrl: env.HANJI_WEBSOCKET_BASE_URL
  };
};
