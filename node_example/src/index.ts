import { HanjiClient, HanjiClientOptions } from 'hanji-ts-sdk';
import { ContractTransactionResponse, JsonRpcProvider, Wallet, Network } from 'ethers';
import BigNumber from 'bignumber.js';

const options: HanjiClientOptions = {
  apiBaseUrl: 'https://api-dev.hanji.io',
  webSocketApiBaseUrl: 'wss://sockets-dev.hanji.io',
  signer: null,
  webSocketConnectImmediately: true,
  autoWaitTransaction: false,
  // or
  // autoWaitTransaction: true,
  // fastWaitTransaction: true,
  // fastWaitTransactionInterval: 100,
};

const hanjiClient = new HanjiClient(options);

const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
if (!privateKey) {
  console.log('Set ACCOUNT_PRIVATE_KEY environment variable');
  process.exit(1);
}
const network = new Network('testnet', 128123n);
const provider = new JsonRpcProvider(
  'https://node.ghostnet.etherlink.com',
  network,
  { pollingInterval: 100, polling: true, staticNetwork: network }
);
const newSigner = new Wallet(privateKey, provider);
hanjiClient.setSigner(newSigner);

const market = '0x3f295daf44fb09bcdf61d7727b8a202e3393f9be'.toLowerCase();
const user = newSigner.address;
let tx: ContractTransactionResponse | undefined;
let placeOrderDate: number, responseDate: number, eventDate: number;

async function waitTx(): Promise<void> {
  while (!tx) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Subscribe to orders
hanjiClient.spot.events.userOrdersUpdated.addListener(async (_, __, orders) => {
  await waitTx();

  const newOrder = orders.find(o => o.txnHash === tx!.hash);
  if (newOrder) {
    eventDate = Date.now();
    console.log(`Event response took ${eventDate - placeOrderDate} milliseconds`);
  }
});
hanjiClient.spot.subscribeToUserOrders({ market, user });

async function transaction() {
  // cache markets once, fetch nonce, make a transaction
  await hanjiClient.spot.getCachedMarkets();
  const nonce = BigInt(await provider.getTransactionCount(user));
  placeOrderDate = Date.now();
  tx = (await hanjiClient.spot.placeOrder({
    market: market,
    type: 'limit',
    side: 'ask',
    price: BigNumber(0.9),
    size: BigNumber(0.1),
    maxCommission: BigNumber(0.1),
    nativeTokenToSend: BigNumber(0.1),
    // additional params
    gasLimit: 20000000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 0n,
    nonce,
  })) as unknown as ContractTransactionResponse; // FIXME: remove type casting
  responseDate = Date.now();
  console.log(`Place order tx response took ${responseDate - placeOrderDate} milliseconds`);
}

transaction().catch(error => console.error('Error in transaction():', error));
