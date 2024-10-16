import BigNumber from 'bignumber.js';
import { Contract, type Signer, ContractTransactionResponse, Signature } from 'ethers';

import { TransactionFailedError } from './errors';
import type {
  ApproveSpotParams,
  BatchChangeOrderSpotParams,
  BatchClaimOrderSpotParams,
  BatchPlaceOrderSpotParams,
  ChangeOrderSpotParams,
  ClaimOrderSpotParams,
  DepositSpotParams,
  PlaceMarketOrderWithTargetValueParams,
  PlaceMarketOrderWithTargetValueWithPermitParams,
  PlaceOrderSpotParams,
  PlaceOrderWithPermitSpotParams,
  SetClaimableStatusParams,
  WithdrawSpotParams
} from './params';
import { erc20Abi, lobAbi, erc20PermitAbi } from '../abi';
import type { Market, Token } from '../models';
import { tokenUtils } from '../utils';
import { wait } from '../utils/delay';

export interface HanjiSpotMarketContractOptions {
  market: Market;
  signer: Signer;
  transferExecutedTokensEnabled?: boolean;
  autoWaitTransaction?: boolean;
  fastWaitTransaction?: boolean;
  fastWaitTransactionInterval?: number;
  fastWaitTransactionTimeout?: number;
}

const DEFAULT_MAX_COMMISSION = 340282366920938463463374607431768211455n; // 2^128 - 1
const DEFAULT_ASK_MARKET_PRICE = 1n;
const DEFAULT_BID_MARKET_PRICE = 999999000000000000000n;
const getExpires = () => BigInt(Math.floor(Date.now() / 1000) + 5 * 60);

type ReadonlyMarket = Readonly<Omit<Market, 'baseToken' | 'quoteToken'>>
  & Readonly<{ baseToken: Readonly<Token>; quoteToken: Readonly<Token> }>;

export class HanjiSpotMarketContract {
  static readonly defaultTransferExecutedTokensEnabled = true;
  static readonly defaultAutoWaitTransaction = true;
  static readonly defaultFastWaitTransaction = false;
  static readonly defaultFastWaitTransactionInterval = 100;

  readonly market: ReadonlyMarket;
  transferExecutedTokensEnabled: boolean;
  autoWaitTransaction: boolean;
  fastWaitTransaction: boolean;
  fastWaitTransactionInterval: number;
  fastWaitTransactionTimeout?: number;

  protected readonly signer: Signer;
  protected readonly marketContract: Contract;
  protected readonly baseTokenContract: Contract;
  protected readonly quoteTokenContract: Contract;
  private _chainId: bigint | undefined;
  protected get chainId(): Promise<bigint> {
    if (this._chainId === undefined) {
      return this.signer.provider!.getNetwork().then(network => {
        this._chainId = network.chainId;
        return this._chainId;
      });
    }
    return Promise.resolve(this._chainId);
  }

  constructor(options: Readonly<HanjiSpotMarketContractOptions>) {
    this.market = options.market;
    this.signer = options.signer;
    this.transferExecutedTokensEnabled = options.transferExecutedTokensEnabled ?? HanjiSpotMarketContract.defaultTransferExecutedTokensEnabled;
    this.autoWaitTransaction = options.autoWaitTransaction ?? HanjiSpotMarketContract.defaultAutoWaitTransaction;
    this.fastWaitTransaction = options.fastWaitTransaction ?? HanjiSpotMarketContract.defaultFastWaitTransaction;
    this.fastWaitTransactionInterval = options.fastWaitTransactionInterval ?? HanjiSpotMarketContract.defaultFastWaitTransactionInterval;
    this.fastWaitTransactionTimeout = options.fastWaitTransactionTimeout;

    this.marketContract = new Contract(this.market.orderbookAddress, lobAbi, options.signer);
    this.baseTokenContract = new Contract(
      this.market.baseToken.contractAddress,
      this.market.baseToken.supportsPermit ? erc20PermitAbi : erc20Abi,
      options.signer
    );
    this.quoteTokenContract = new Contract(
      this.market.quoteToken.contractAddress,
      this.market.quoteToken.supportsPermit ? erc20PermitAbi : erc20Abi,
      options.signer
    );
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
    const tx = await this.processContractMethodCall(
      tokenContract,
      tokenContract.approve!(
        params.market,
        amount,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      ));

    return tx;
  }

  async depositTokens(params: DepositSpotParams): Promise<ContractTransactionResponse> {
    const baseTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.baseTokenAmount, this.market.tokenXScalingFactor);
    const quoteTokenAmount = this.convertTokensAmountToRawAmountIfNeeded(params.quoteTokenAmount, this.market.tokenYScalingFactor);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.depositTokens!(
        baseTokenAmount,
        quoteTokenAmount,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
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
      this.marketContract.withdrawTokens!(
        withdrawAll,
        baseTokenAmount,
        quoteTokenAmount,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async setClaimableStatus(params: SetClaimableStatusParams): Promise<ContractTransactionResponse> {
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.setClaimableStatus!(
        params.status,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async placeOrder(params: PlaceOrderSpotParams): Promise<ContractTransactionResponse> {
    if (params.nativeTokenToSend !== undefined && this.market.supportsNativeToken
      && !((params.side === 'ask' && this.market.isNativeTokenX) || (params.side !== 'ask' && !this.market.isNativeTokenX))) {
      throw Error('Token to send is not native.');
    }

    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.market.tokenXScalingFactor);
    let priceAmount;
    if (params.type === 'market_execution') {
      priceAmount = params.side === 'ask' ? DEFAULT_ASK_MARKET_PRICE : DEFAULT_BID_MARKET_PRICE;
    }
    else {
      priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.market.priceScalingFactor);
    }
    const expires = getExpires();
    const maxCommission = params.maxCommission === undefined ? DEFAULT_MAX_COMMISSION : this.convertTokensAmountToRawAmountIfNeeded(params.maxCommission, this.market.tokenYScalingFactor);
    const value = params.nativeTokenToSend === undefined
      ? 0n
      : this.convertTokensAmountToRawAmountIfNeeded(params.nativeTokenToSend,
        params.side === 'ask' ? this.market.baseToken.decimals : this.market.quoteToken.decimals);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeOrder!(
        params.side === 'ask',
        sizeAmount,
        priceAmount,
        maxCommission,
        params.type === 'ioc' || params.type === 'market_execution',
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires,
        {
          value,
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async placeOrderWithPermit(params: PlaceOrderWithPermitSpotParams): Promise<ContractTransactionResponse> {
    if ((params.side === 'ask' && !this.market.baseToken.supportsPermit)
      || (params.side === 'bid' && !this.market.quoteToken.supportsPermit)) {
      throw Error('Token doesn\'t support permits');
    }
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.market.tokenXScalingFactor);
    let priceAmount;
    if (params.type === 'market_execution') {
      priceAmount = params.side === 'ask' ? DEFAULT_ASK_MARKET_PRICE : DEFAULT_BID_MARKET_PRICE;
    }
    else {
      priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.market.priceScalingFactor);
    }
    let quantityToPermit, amountToPermit: bigint;
    if (params.side === 'ask') {
      amountToPermit = this.convertTokensAmountToRawAmountIfNeeded(
        params.permit,
        this.market.tokenXScalingFactor
      );
      quantityToPermit = amountToPermit * 10n ** BigInt(
        this.market.baseToken.decimals - this.market.tokenXScalingFactor);
    }
    else {
      amountToPermit = this.convertTokensAmountToRawAmountIfNeeded(
        params.permit,
        this.market.tokenYScalingFactor
      );
      quantityToPermit = amountToPermit * 10n ** BigInt(
        this.market.quoteToken.decimals - this.market.tokenYScalingFactor);
    }

    const expires = getExpires();
    const maxCommission = params.maxCommission === undefined ? DEFAULT_MAX_COMMISSION : this.convertTokensAmountToRawAmountIfNeeded(params.maxCommission, this.market.tokenYScalingFactor);
    const { v, r, s } = await this.signPermit(params.side === 'ask', quantityToPermit, expires);
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeOrder!(
        params.side === 'ask',
        sizeAmount,
        priceAmount,
        maxCommission,
        amountToPermit,
        params.type === 'ioc' || params.type === 'market_execution',
        params.type === 'limit_post_only',
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires,
        v,
        r,
        s,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async placeMarketOrderWithTargetValue(params: PlaceMarketOrderWithTargetValueParams): Promise<ContractTransactionResponse> {
    if (params.nativeTokenToSend !== undefined && this.market.supportsNativeToken
      && !((params.side === 'ask' && this.market.isNativeTokenX) || (params.side !== 'ask' && !this.market.isNativeTokenX))) {
      throw Error('Token to send is not native.');
    }

    const targetTokenYValue = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.market.tokenYScalingFactor);
    let priceAmount;
    if (params.type === 'market_execution') {
      priceAmount = params.side === 'ask' ? DEFAULT_ASK_MARKET_PRICE : DEFAULT_BID_MARKET_PRICE;
    }
    else {
      priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.market.priceScalingFactor);
    }
    const maxCommission = params.maxCommission === undefined ? DEFAULT_MAX_COMMISSION : this.convertTokensAmountToRawAmountIfNeeded(params.maxCommission, this.market.tokenYScalingFactor);
    const expires = getExpires();
    const value = params.nativeTokenToSend === undefined
      ? 0n
      : this.convertTokensAmountToRawAmountIfNeeded(params.nativeTokenToSend,
        params.side === 'ask' ? this.market.baseToken.decimals : this.market.quoteToken.decimals);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeMarketOrderWithTargetValue!(
        params.side === 'ask',
        targetTokenYValue,
        priceAmount,
        maxCommission,
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires,
        {
          value,
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async placeMarketOrderWithTargetValueWithPermit(params: PlaceMarketOrderWithTargetValueWithPermitParams): Promise<ContractTransactionResponse> {
    if ((params.side === 'ask' && !this.market.baseToken.supportsPermit)
      || (params.side === 'bid' && !this.market.quoteToken.supportsPermit)) {
      throw Error('Token doesn\'t support permits');
    }

    const targetTokenYValue = this.convertTokensAmountToRawAmountIfNeeded(params.size, this.market.tokenYScalingFactor);
    let priceAmount;
    if (params.type === 'market_execution') {
      priceAmount = params.side === 'ask' ? DEFAULT_ASK_MARKET_PRICE : DEFAULT_BID_MARKET_PRICE;
    }
    else {
      priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.price, this.market.priceScalingFactor);
    }
    let quantityToPermit, amountToPermit: bigint;
    if (params.side === 'ask') {
      amountToPermit = this.convertTokensAmountToRawAmountIfNeeded(
        params.permit,
        this.market.tokenXScalingFactor
      );
      quantityToPermit = amountToPermit * 10n ** BigInt(
        this.market.baseToken.decimals - this.market.tokenXScalingFactor);
    }
    else {
      amountToPermit = this.convertTokensAmountToRawAmountIfNeeded(
        params.permit,
        this.market.tokenYScalingFactor
      );
      quantityToPermit = amountToPermit * 10n ** BigInt(
        this.market.quoteToken.decimals - this.market.tokenYScalingFactor);
    }
    const maxCommission = params.maxCommission === undefined ? DEFAULT_MAX_COMMISSION : this.convertTokensAmountToRawAmountIfNeeded(params.maxCommission, this.market.tokenYScalingFactor);
    const expires = getExpires();
    const { v, r, s } = await this.signPermit(params.side === 'ask', quantityToPermit, expires);

    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.placeMarketOrderWithTargetValue!(
        params.side === 'ask',
        targetTokenYValue,
        priceAmount,
        maxCommission,
        amountToPermit,
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires,
        v,
        r,
        s,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
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
        expires,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async claimOrder(params: ClaimOrderSpotParams): Promise<ContractTransactionResponse> {
    const expires = getExpires();
    const tx = await this.processContractMethodCall(
      this.marketContract,
      this.marketContract.claimOrder!(
        params.orderId,
        params.onlyClaim,
        params.transferExecutedTokens ?? this.transferExecutedTokensEnabled,
        expires,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        })
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
      this.marketContract.batchClaim!(
        addresses,
        orderIds,
        params.onlyClaim,
        expires,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  async changeOrder(params: ChangeOrderSpotParams): Promise<ContractTransactionResponse> {
    const sizeAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newSize, this.market.tokenXScalingFactor);
    const priceAmount = this.convertTokensAmountToRawAmountIfNeeded(params.newPrice, this.market.priceScalingFactor);
    const maxCommission = this.convertTokensAmountToRawAmountIfNeeded(params.maxCommission, this.market.tokenYScalingFactor);
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
        expires,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
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
        expires,
        {
          gasLimit: params.gasLimit,
          nonce: params.nonce,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
        }
      )
    );

    return tx;
  }

  protected async processContractMethodCall(contract: Contract, methodCall: Promise<ContractTransactionResponse>): Promise<ContractTransactionResponse> {
    try {
      const tx = await methodCall;

      if (this.autoWaitTransaction) {
        if (this.fastWaitTransaction) {
          const startingTime = Date.now();
          let receipt = await tx.provider.getTransactionReceipt(tx.hash);

          while (receipt == null) {
            if (this.fastWaitTransactionTimeout && Date.now() - startingTime >= this.fastWaitTransactionTimeout) {
              break; // timeout reached
            }

            await wait(this.fastWaitTransactionInterval);
            receipt = await tx.provider.getTransactionReceipt(tx.hash);
          }
        }
        else {
          await tx.wait();
        }
      }

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

  private async signPermit(isBaseToken: boolean, quantityToPermit: bigint, deadline: bigint): Promise<{ v: string; r: string; s: string }> {
    const tokenContract = isBaseToken ? this.baseTokenContract : this.quoteTokenContract;

    const owner = await this.signer.getAddress();
    const spender = this.market.orderbookAddress;

    const domain = {
      name: await tokenContract.name!(),
      version: '1',
      chainId: await this.chainId,
      verifyingContract: await tokenContract.getAddress(),
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const nonce = await tokenContract.nonces!(owner);
    const message = {
      owner,
      spender,
      value: quantityToPermit,
      nonce,
      deadline,
    };
    const signature = await this.signer.signTypedData(domain, types, message);
    const splitSig = Signature.from(signature);

    return {
      v: splitSig.v.toString(),
      r: splitSig.r,
      s: splitSig.s,
    };
  }
}
