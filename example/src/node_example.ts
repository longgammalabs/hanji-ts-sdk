import { HanjiClient, HanjiClientOptions } from 'hanji-ts-sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import BigNumber from 'bignumber.js';

const options: HanjiClientOptions = {
  apiBaseUrl: 'https://api.hanji.io',
  webSocketApiBaseUrl: 'wss://ws.hanji.io',
  signer: null,
  webSocketConnectImmediately: false,
};

const hanjiClient = new HanjiClient(options);

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.log('Set PRIVATE_KEY environment variable');
  process.exit(1);
}
const provider = new JsonRpcProvider('https://node.ghostnet.etherlink.com');
const newSigner = new Wallet(privateKey, provider);
hanjiClient.setSigner(newSigner);

const market = '0x8f7119da742cE3919999c106A102399036Cce570'.toLowerCase();
async function transaction() {
  const info = await hanjiClient.spot.getMarket({ market });
  const tx = await hanjiClient.spot.placeOrder({
    market: info!.id,
    type: 'limit',
    side: 'ask',
    price: new BigNumber(0.9),
    size: new BigNumber(0.1),
    maxCommission: new BigNumber(0.01),
    quantityToSend: new BigNumber(0.09),
  });
  console.log('tx', tx);
}

async function timedTransaction() {
  const start = Date.now();
  try {
    await transaction();
  }
  catch (error) {
    console.error('Transaction failed:', error);
  }
  finally {
    const end = Date.now();
    console.log(`Transaction call took ${(end - start)} milliseconds`);
  }
}

timedTransaction().catch(error => console.error('Error in timedTransaction:', error));
