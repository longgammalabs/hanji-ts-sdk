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
import type { Market, Token } from '../models';
import { tokenUtils } from '../utils';

export interface HanjiSpotMarketContractOptions {
  market: Market;
  signerOrProvider: Signer | Provider;
  transferExecutedTokensEnabled?: boolean;
  autoWaitTransaction?: boolean;
}

const getExpires = () => BigInt(Math.floor(Date.now() / 1000) + 5 * 60);

type ReadonlyMarket = Readonly<Omit<Market, 'baseToken' | 'quoteToken'>>
  & Readonly<{ baseToken: Readonly<Token>; quoteToken: Readonly<Token> }>;

export class HanjiSpotMarketContract {
  static readonly defaultTransferExecutedTokensEnabled = true;
  static readonly defaultAutoWaitTransaction = true;

  readonly market: ReadonlyMarket;
  transferExecutedTokensEnabled: boolean;
  autoWaitTransaction: boolean;

  protected readonly signerOrProvider: Signer | Provider;
  protected readonly marketContract: Contract;
  protected readonly baseTokenContract: Contract;
  protected readonly quoteTokenContract: Contract;

  constructor(options: Readonly<HanjiSpotMarketContractOptions>) {
    this.market = options.market;
    this.signerOrProvider = options.signerOrProvider;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled ?? HanjiSpotMarketContract.defaultTransferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction ?? HanjiSpotMarketContract.defaultAutoWaitTransaction;

    this.marketContract = new Contract(this.market.orderbookAddress, lobAbi, options.signerOrProvider);
    this.baseTokenContract = new Contract(this.market.baseToken.contractAddress, erc20Abi, options.signerOrProvider);
    this.quoteTokenContract = new Contract(this.market.quoteToken.contractAddress, erc20Abi, options.signerOrProvider);
  }

  async approveTokens(params: ApproveSpotParams): Promise<ContractTransactionResponse> {
    let token: Token;
    let tokenContract: Contract;

    if (params.isBaseToken) {
      token = this.market.baseToken;
      tokenContract = this.baseTokenContract;
    }
    else {
      token = this.market.quoteToken;
      tokenContract = this.quoteTokenContract;
    }

    const amount = this.convertTokensAmountToRawAmountIfNeeded(params.amount, token.decimals);
    const tx = await this.processContractMethodCall(tokenContract, tokenContract.approve!(params.market, amount));

    return tx;
  }

  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const baseTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.baseTokenAmount, this.market.tokenXScalingFactor);
    const quoteTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.quoteTokenAmount, this.market.tokenYScalingFactor);

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
      baseTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.baseTokenAmount, this.market.tokenXScalingFactor);
      quoteTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.quoteTokenAmount, this.market.tokenYScalingFactor);
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
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.market.tokenXScalingFactor);
    const priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.market.priceScalingFactor);
    const expires = getExpires();
    const maxCommission = this.calculateMaxCommission(sizeAmount, priceAmount);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeOrder!(
        params.side === 'ask',
        sizeAmount,
        priceAmount,
        maxCommission,
        params.type === 'market',
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires
      )
    );

    return tx;
  }

  async batchPlaceOrder(params: BatchPlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    const directions: boolean[] = [];
    const sizeAmounts: bigint[] = [];
    const priceAmounts: bigint[] = [];
    const expires = getExpires();

    for (const orderParams of params.orderParams) {
      directions.push(orderParams.side === 'ask');
      sizeAmounts.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.size, this.market.tokenXScalingFactor));
      priceAmounts.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.price, this.market.priceScalingFactor));
    }

    const maxCommissionPerOrder = this.calculateMaxCommissionPerOrder(sizeAmounts, priceAmounts);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchPlaceOrder!(
        directions,
        sizeAmounts,
        priceAmounts,
        maxCommissionPerOrder,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires
      )
    );

    return tx;
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const expires = getExpires();
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.claimOrder!(params.orderId, params.transferExecutedTokens ?? this.transferExecutedTokensEnabled, expires)
    );

    return tx;
  }

  async batchClaim(params: BatchClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const addresses: string[] = [];
    const orderIds: string[] = [];
    const expires = getExpires();

    for (const claimParams of params.claimParams) {
      addresses.push(claimParams.address);
      orderIds.push(claimParams.orderId);
    }

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchClaim!(addresses, orderIds, expires)
    );

    return tx;
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newSize, this.market.tokenXScalingFactor);
    const priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newPrice, this.market.priceScalingFactor);
    const maxCommission = this.calculateMaxCommission(sizeAmount, priceAmount);
    const expires = getExpires();

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.changeOrder!(
        params.orderId,
        sizeAmount,
        priceAmount,
        maxCommission,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires
      )
    );

    return tx;
  }

  async batchChangeOrder(params: BatchChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const orderIds: string[] = [];
    const newSizes: bigint[] = [];
    const newPrices: bigint[] = [];
    const expires = getExpires();

    for (const orderParams of params.orderParams) {
      orderIds.push(orderParams.orderId);
      newSizes.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.newSize, this.market.tokenXScalingFactor));
      newPrices.push(this.convertTokensAmountToRawAmountIfNeeded(orderParams.newPrice, this.market.priceScalingFactor));
    }

    const maxCommissionPerOrder = this.calculateMaxCommissionPerOrder(newSizes, newPrices);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.batchChangeOrder!(
        orderIds,
        newSizes,
        newPrices,
        maxCommissionPerOrder,
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires
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

  private calculateMaxCommission(sizeAmount: bigint, priceAmount: bigint): bigint {
    return BigInt(
      BigNumber(sizeAmount.toString())
        .times(BigNumber(priceAmount.toString()))
        .times(0.00035)
        .decimalPlaces(0, BigNumber.ROUND_CEIL)
        .toString()
    );
  }

  private calculateMaxCommissionPerOrder(sizeAmounts: bigint[], priceAmounts: bigint[]): bigint {
    let maxCommission = 0n;

    for (let i = 0; i < sizeAmounts.length; i++) {
      const commission = this.calculateMaxCommission(sizeAmounts[i] ?? 0n, priceAmounts[i] ?? 0n);
      if (commission > maxCommission) {
        maxCommission = commission;
      }
    }

    return maxCommission;
  }
}
