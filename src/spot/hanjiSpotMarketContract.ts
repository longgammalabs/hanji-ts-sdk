import BigNumber from 'bignumber.js';
import { Contract, parseUnits, type Provider, type Signer, type ContractTransactionResponse } from 'ethers';

import type {
  ApproveSpotParams,
  BatchChangeOrderSpotParams,
  BatchClaimOrderSpotParams,
  BatchPlaceOrderSpotParams,
  ChangeOrderSpotParams,
  ClaimOrderSpotParams,
  DepositSpotParams,
  PlaceOrderSpotParams,
  SetClaimableStatusParams,
  WithdrawSpotParams
} from './params';
import { erc20Abi, lobAbi } from '../abi';
import { OrderType, Side, type Token } from '../models';

export interface HanjiSpotMarketContractOptions {
  name: string;
  marketContractAddress: string;
  baseToken: Token;
  quoteToken: Token;
  signerOrProvider: Signer | Provider;
  transferExecutedTokensEnabled?: boolean;
  autoWaitTransaction?: boolean;
}

export class HanjiSpotMarketContract {
  static readonly defaultTransferExecutedTokensEnabled = true;
  static readonly defaultAutoWaitTransaction = true;

  readonly name: string;
  readonly contractAddress: string;
  readonly baseToken: Token;
  readonly quoteToken: Token;
  transferExecutedTokensEnabled: boolean;
  autoWaitTransaction: boolean;

  protected readonly singerOrProvider: Signer | Provider;
  protected readonly marketContract: Contract;
  protected readonly baseTokenContract: Contract;
  protected readonly quoteTokenContract: Contract;

  constructor(options: Readonly<HanjiSpotMarketContractOptions>) {
    this.name = options.name;
    this.contractAddress = options.marketContractAddress;
    this.baseToken = options.baseToken;
    this.quoteToken = options.quoteToken;
    this.singerOrProvider = options.signerOrProvider;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled ?? HanjiSpotMarketContract.defaultTransferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction ?? HanjiSpotMarketContract.defaultAutoWaitTransaction;

    this.marketContract = new Contract(options.marketContractAddress, lobAbi, options.signerOrProvider);
    this.baseTokenContract = new Contract(options.baseToken.contractAddress, erc20Abi, options.signerOrProvider);
    this.quoteTokenContract = new Contract(options.quoteToken.contractAddress, erc20Abi, options.signerOrProvider);
  }

  async approveTokens(params: ApproveSpotParams): Promise<ContractTransactionResponse> {
    let token: Token;
    let tokenContract: Contract;

    if (params.isBaseToken) {
      token = this.baseToken;
      tokenContract = this.baseTokenContract;
    }
    else {
      token = this.quoteToken;
      tokenContract = this.quoteTokenContract;
    }

    const amount = this.prepareTokenAmount(params.amount, token, true);
    const tx: ContractTransactionResponse = await tokenContract.approve!(params.market, amount);
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const baseTokenAmount = this.prepareTokenAmount(params.baseTokenAmount, this.baseToken);
    const quoteTokenAmount = this.prepareTokenAmount(params.quoteTokenAmount, this.quoteToken);

    const tx: ContractTransactionResponse = await this.marketContract.depositTokens!(
      baseTokenAmount,
      quoteTokenAmount
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async withdrawTokens(params: WithdrawSpotParams): Promise<ContractTransactionResponse> {
    const withdrawAll = !!params.withdrawAll;
    let baseTokenAmount: bigint;
    let quoteTokenAmount: bigint;

    if (withdrawAll) {
      baseTokenAmount = 0n;
      quoteTokenAmount = 0n;
    }
    else {
      baseTokenAmount = this.prepareTokenAmount(params.baseTokenAmount, this.baseToken);
      quoteTokenAmount = this.prepareTokenAmount(params.quoteTokenAmount, this.quoteToken);
    }

    const tx: ContractTransactionResponse = await this.marketContract.withdrawTokens!(
      withdrawAll,
      baseTokenAmount,
      quoteTokenAmount
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async setClaimableStatus(params: SetClaimableStatusParams): Promise<ContractTransactionResponse> {
    const tx = await this.marketContract.setClaimableStatus!(
      params.status
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async placeOrder(params: PlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.prepareTokenAmount(params.size, this.baseToken);
    const priceAmount = this.prepareTokenAmount(params.price, this.quoteToken);

    const tx: ContractTransactionResponse = await this.marketContract.placeOrder!(
      params.side === Side.ASK,
      sizeAmount,
      priceAmount,
      params.type === OrderType.MARKET,
      params.type === OrderType.LIMIT_POST_ONLY,
      params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const directions: boolean[] = [];
    const sizeAmounts: bigint[] = [];
    const priceAmounts: bigint[] = [];

    for (const orderParams of params.orderParams) {
      directions.push(orderParams.side === Side.ASK);
      sizeAmounts.push(this.prepareTokenAmount(orderParams.size, this.baseToken));
      priceAmounts.push(this.prepareTokenAmount(orderParams.price, this.quoteToken));
    }

    const tx: ContractTransactionResponse = await this.marketContract.batchPlaceOrder!(
      directions,
      sizeAmounts,
      priceAmounts,
      params.type === OrderType.LIMIT_POST_ONLY,
      params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const tx: ContractTransactionResponse = await this.marketContract.claimOrder!(
      params.orderId,
      params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async batchClaim(params: BatchClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const addresses: string[] = [];
    const orderIds: string[] = [];

    for (const claimParams of params.claimParams) {
      addresses.push(claimParams.address);
      orderIds.push(claimParams.orderId);
    }

    const tx: ContractTransactionResponse = await this.marketContract.batchClaim!(
      addresses,
      orderIds
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.prepareTokenAmount(params.newSize, this.baseToken);
    const priceAmount = this.prepareTokenAmount(params.newPrice, this.quoteToken);

    const tx: ContractTransactionResponse = await this.marketContract.changeOrder!(
      params.orderId,
      sizeAmount,
      priceAmount,
      params.type === OrderType.LIMIT_POST_ONLY,
      params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const orderIds: string[] = [];
    const newSizes: bigint[] = [];
    const newPrices: bigint[] = [];

    for (const orderParams of params.orderParams) {
      orderIds.push(orderParams.orderId);
      newSizes.push(this.prepareTokenAmount(orderParams.newSize, this.baseToken));
      newPrices.push(this.prepareTokenAmount(orderParams.newPrice, this.quoteToken));
    }

    const tx: ContractTransactionResponse = await this.marketContract.batchChangeOrder!(
      orderIds,
      newSizes,
      newPrices,
      params.type === OrderType.LIMIT_POST_ONLY,
      params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
    );
    if (this.autoWaitTransaction)
      await tx.wait();

    return tx;
  }

  private prepareTokenAmount(amount: BigNumber | bigint, token: Token, isActualAmount = false): bigint {
    return typeof amount === 'bigint'
      ? amount
      : parseUnits(amount.toString(10), isActualAmount ? token.decimals : token.scalingFactor);
  }
}
