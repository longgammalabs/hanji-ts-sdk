import BigNumber from 'bignumber.js';
import { Contract, type Provider, type Signer, parseUnits } from 'ethers';

import type { ApproveParams, ClaimOrderParams, DepositParams, PlaceOrderParams, WithdrawParams } from './params';
import { erc20Abi, lobAbi } from '../abi';
import { type Token } from '../models';
import { HanjiService } from '../services';

export interface HanjiMarketClientOptions {
  hanjiService: HanjiService;
  singerOrProvider: Signer | Provider;

  name: string;
  marketContractAddress: string;
  baseToken: Token;
  quoteToken: Token;
}

export class HanjiMarketClient {
  private readonly marketContract: Contract;
  private readonly baseTokenContract: Contract;
  private readonly quoteTokenContract: Contract;

  constructor(private readonly options: Readonly<HanjiMarketClientOptions>) {
    this.marketContract = new Contract(options.marketContractAddress, lobAbi, options.singerOrProvider);
    this.baseTokenContract = new Contract(options.baseToken.contractAddress, erc20Abi, options.singerOrProvider);
    this.quoteTokenContract = new Contract(options.quoteToken.contractAddress, erc20Abi, options.singerOrProvider);
  }

  async approve(params: ApproveParams): Promise<string> {
    let token: Token;
    let tokenContract: Contract;

    if (params.isBaseToken) {
      token = this.options.baseToken;
      tokenContract = this.baseTokenContract;
    }
    else {
      token = this.options.quoteToken;
      tokenContract = this.quoteTokenContract;
    }

    const amount = this.prepareTokenAmount(params.amount, token, true);
    const tx = await tokenContract.approve!(params.spenderAddress, amount);
    await tx.wait();

    return tx.hash;
  }

  async deposit(params: DepositParams): Promise<string> {
    const baseTokenAmount = this.prepareTokenAmount(params.baseTokenAmount, this.options.baseToken);
    const quoteTokenAmount = this.prepareTokenAmount(params.quoteTokenAmount, this.options.quoteToken);

    const contractCallParams = [baseTokenAmount, quoteTokenAmount];

    const tx = await this.marketContract.deposit!(contractCallParams);
    await tx.wait();

    return tx.hash;
  }

  async withdraw(params: WithdrawParams): Promise<string> {
    const contractCallParams = params.withdrawAll
      ? [true, 0, 0]
      : [
        false,
        this.prepareTokenAmount(params.baseTokenAmount, this.options.baseToken),
        this.prepareTokenAmount(params.quoteTokenAmount, this.options.quoteToken)
      ];


    const tx = await this.marketContract.withdraw!(contractCallParams);
    await tx.wait();

    return tx.hash;
  }

  async placeOrder(params: PlaceOrderParams): Promise<string> {
    throw new Error('Not implemented');
  }

  async claimOrder(params: ClaimOrderParams): Promise<string> {
    throw new Error('Not implemented');
  }

  private prepareTokenAmount(amount: BigNumber | bigint, token: Token, isActualAmount = false): bigint {
    return typeof amount === 'bigint'
      ? amount
      : parseUnits(amount.toString(10), isActualAmount ? token.decimals : token.scalingFactor);
  }
}
