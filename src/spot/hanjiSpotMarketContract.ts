import BigNumber from 'bignumber.js';
import { Contract, type Provider, type Signer, type ContractTransactionResponse } from 'ethers';

import { TransactionFailedError } from './errors';
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
import type { MarketInfo, Token } from '../models';
import { tokenUtils } from '../utils';

export interface HanjiSpotMarketContractOptions {
  marketInfo: MarketInfo;
  signerOrProvider: Signer | Provider;
  transferExecutedTokensEnabled?: boolean;
  autoWaitTransaction?: boolean;
}

type ReadonlyMarketInfo = Readonly<Omit<MarketInfo, 'baseToken' | 'quoteToken' | 'scalingFactors'>>
  & Readonly<{ baseToken: Readonly<Token>; quoteToken: Readonly<Token>; scalingFactors: Readonly<MarketInfo['scalingFactors']> }>;

export class HanjiSpotMarketContract {
  static readonly defaultTransferExecutedTokensEnabled = true;
  static readonly defaultAutoWaitTransaction = true;

  readonly marketInfo: ReadonlyMarketInfo;
  transferExecutedTokensEnabled: boolean;
  autoWaitTransaction: boolean;

  protected readonly singerOrProvider: Signer | Provider;
  protected readonly marketContract: Contract;
  protected readonly baseTokenContract: Contract;
  protected readonly quoteTokenContract: Contract;

  constructor(options: Readonly<HanjiSpotMarketContractOptions>) {
    this.marketInfo = options.marketInfo;
    this.singerOrProvider = options.signerOrProvider;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled ?? HanjiSpotMarketContract.defaultTransferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction ?? HanjiSpotMarketContract.defaultAutoWaitTransaction;

    this.marketContract = new Contract(this.marketInfo.orderbookAddress, lobAbi, options.signerOrProvider);
    this.baseTokenContract = new Contract(this.marketInfo.baseToken.contractAddress, erc20Abi, options.signerOrProvider);
    this.quoteTokenContract = new Contract(this.marketInfo.quoteToken.contractAddress, erc20Abi, options.signerOrProvider);
  }

  async approveTokens(params: ApproveSpotParams): Promise<ContractTransactionResponse> {
    let token: Token;
    let tokenContract: Contract;

    if (params.isBaseToken) {
      token = this.marketInfo.baseToken;
      tokenContract = this.baseTokenContract;
    }
    else {
      token = this.marketInfo.quoteToken;
      tokenContract = this.quoteTokenContract;
    }

    const amount = this.convertTokensAmountToRawAmountIfNeeded(params.amount, token.decimals);
    const tx = await this.processContractMethodCall(tokenContract, tokenContract.approve!(params.market, amount));

    return tx;
  }

  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const baseTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.baseTokenAmount, this.marketInfo.scalingFactors.baseToken);
    const quoteTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.quoteTokenAmount, this.marketInfo.scalingFactors.quoteToken);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.depositTokens!(baseTokenAmount, quoteTokenAmount)
    );

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
      baseTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.baseTokenAmount, this.marketInfo.scalingFactors.baseToken);
      quoteTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.quoteTokenAmount, this.marketInfo.scalingFactors.quoteToken);
    }

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.withdrawTokens!(withdrawAll, baseTokenAmount, quoteTokenAmount)
    );

    return tx;
  }

  async setClaimableStatus(params: SetClaimableStatusParams): Promise<ContractTransactionResponse> {
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.setClaimableStatus!(params.status)
    );

    return tx;
  }

  async placeOrder(params: PlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.marketInfo.scalingFactors.baseToken);
    const priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.marketInfo.scalingFactors.price);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeOrder!(
        params.side === 'ask',
        sizeAmount,
        priceAmount,
        params.type === 'market',
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
      )
    );

    return tx;
  }

  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const directions: boolean[] = [];
    const sizeAmounts: bigint[] = [];
    const priceAmounts: bigint[] = [];

    for (const orderParams of params.orderParams) {
      directions.push(orderParams.side === 'ask');
      sizeAmounts.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.size, this.marketInfo.scalingFactors.baseToken));
      priceAmounts.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.price, this.marketInfo.scalingFactors.price));
    }

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchPlaceOrder!(
        directions,
        sizeAmounts,
        priceAmounts,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
      )
    );

    return tx;
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.claimOrder!(params.orderId, params.transferExecutedTokens ?? this.transferExecutedTokensEnabled)
    );

    return tx;
  }

  async batchClaim(params: BatchClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const addresses: string[] = [];
    const orderIds: string[] = [];

    for (const claimParams of params.claimParams) {
      addresses.push(claimParams.address);
      orderIds.push(claimParams.orderId);
    }

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchClaim!(addresses, orderIds)
    );

    return tx;
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newSize, this.marketInfo.scalingFactors.baseToken);
    const priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newPrice, this.marketInfo.scalingFactors.price);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.changeOrder!(
        params.orderId,
        sizeAmount,
        priceAmount,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
      )
    );

    return tx;
  }

  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const orderIds: string[] = [];
    const newSizes: bigint[] = [];
    const newPrices: bigint[] = [];

    for (const orderParams of params.orderParams) {
      orderIds.push(orderParams.orderId);
      newSizes.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.newSize, this.marketInfo.scalingFactors.baseToken));
      newPrices.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.newPrice, this.marketInfo.scalingFactors.price));
    }

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchChangeOrder!(
        orderIds,
        newSizes,
        newPrices,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled
      )
    );

    return tx;
  }

  protected async processContractMethodCall(contract: Contract, methodCall: Promise<ContractTransactionResponse>): Promise<ContractTransactionResponse> {
    try {
      const tx = await methodCall;

      if (this.autoWaitTransaction)
        await tx.wait();

      return tx;
    }
    catch (error) {
      if ((error as any).data) {
        const decodedError = contract.interface.parseError((error as any).data);

        throw new TransactionFailedError((error as any).data, decodedError, { cause: error });
      }

      throw error;
    }
  }

  private convertTokensAmountToRawAmountIfNeeded(amount: BigNumber | bigint, decimals: number): bigint {
    return typeof amount === 'bigint'
      ? amount
      : tokenUtils.convertTokensAmountToRawAmount(amount, decimals);
  }
}
