export const lobAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenXAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenYAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'scaling_token_x',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'scaling_token_y',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_administrator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_marketmaker',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_should_invoke_on_trade',
        type: 'bool',
      },
      {
        internalType: 'uint128',
        name: '_admin_commission',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_marketmaker_commission',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_passive_order_payout',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_commission_scaling_factor',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'approvePendingAdministrator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ArrayLengthMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'order_ids',
        type: 'uint64[]',
      },
      {
        internalType: 'uint64[]',
        name: 'quantities',
        type: 'uint64[]',
      },
      {
        internalType: 'uint24[]',
        name: 'prices',
        type: 'uint24[]',
      },
      {
        internalType: 'bool',
        name: 'post_only',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'transfer_tokens',
        type: 'bool',
      },
    ],
    name: 'batchChangeOrder',
    outputs: [
      {
        internalType: 'uint64[]',
        name: 'new_order_ids',
        type: 'uint64[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
      {
        internalType: 'uint64[]',
        name: 'order_ids',
        type: 'uint64[]',
      },
    ],
    name: 'batchClaim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool[]',
        name: 'directions',
        type: 'bool[]',
      },
      {
        internalType: 'uint64[]',
        name: 'quantities',
        type: 'uint64[]',
      },
      {
        internalType: 'uint24[]',
        name: 'prices',
        type: 'uint24[]',
      },
      {
        internalType: 'bool',
        name: 'post_only',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'transfer_tokens',
        type: 'bool',
      },
    ],
    name: 'batchPlaceOrder',
    outputs: [
      {
        internalType: 'uint64[]',
        name: 'new_order_ids',
        type: 'uint64[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_marketmaker',
        type: 'address',
      },
    ],
    name: 'changeMarketMakerAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'old_order_id',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'new_quantity',
        type: 'uint64',
      },
      {
        internalType: 'uint24',
        name: 'new_price',
        type: 'uint24',
      },
      {
        internalType: 'bool',
        name: 'post_only',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'transfer_tokens',
        type: 'bool',
      },
    ],
    name: 'changeOrder',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: 'transfer_tokens',
        type: 'bool',
      },
    ],
    name: 'claimOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ClaimstatusDoesntAllowNonOwnerClaims',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CommissionParamTooHigh',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'token_x_amount',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'token_y_amount',
        type: 'uint64',
      },
    ],
    name: 'depositTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Forbidden',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientTokenXBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientTokenYBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketOnlyAndPostOnlyFlagsConflict',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NonceExhaustedFailure',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyOwnerCanCancelOrders',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isAsk',
        type: 'bool',
      },
      {
        internalType: 'uint64',
        name: 'quantity',
        type: 'uint64',
      },
      {
        internalType: 'uint24',
        name: 'price',
        type: 'uint24',
      },
      {
        internalType: 'bool',
        name: 'market_only',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'post_only',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'transfer_executed_tokens',
        type: 'bool',
      },
    ],
    name: 'placeOrder',
    outputs: [
      {
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroCommissionScallingFactor',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroTokenTransferNotAllowed',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'token_x_sent',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'token_y_sent',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'passive_payout',
        type: 'uint64',
      },
    ],
    name: 'ClaimOrderEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'isAsk',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint24',
        name: 'price',
        type: 'uint24',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'quantity',
        type: 'uint64',
      },
    ],
    name: 'MarketOrderEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'isAsk',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint24',
        name: 'price',
        type: 'uint24',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'quantity',
        type: 'uint64',
      },
    ],
    name: 'PlaceOrderEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'status',
        type: 'bool',
      },
    ],
    name: 'setClaimableStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'status',
        type: 'bool',
      },
    ],
    name: 'SetClaimableStatusEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pending_administrator',
        type: 'address',
      },
    ],
    name: 'setPendingAdministrator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'withdraw_all',
        type: 'bool',
      },
      {
        internalType: 'uint64',
        name: 'token_x_amount',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'token_y_amount',
        type: 'uint64',
      },
    ],
    name: 'withdrawTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isAsk',
        type: 'bool',
      },
      {
        internalType: 'uint24',
        name: 'max_price_levels',
        type: 'uint24',
      },
    ],
    name: 'assembleOrderbookFromOrders',
    outputs: [
      {
        internalType: 'uint24[]',
        name: 'array_prices',
        type: 'uint24[]',
      },
      {
        internalType: 'uint64[]',
        name: 'array_shares',
        type: 'uint64[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
    ],
    name: 'extractDirectionAndPrice',
    outputs: [
      {
        internalType: 'bool',
        name: 'isAsk',
        type: 'bool',
      },
      {
        internalType: 'uint24',
        name: 'price',
        type: 'uint24',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firstLevel',
    outputs: [
      {
        internalType: 'uint24',
        name: 'bid',
        type: 'uint24',
      },
      {
        internalType: 'uint24',
        name: 'ask',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        internalType: 'uint256',
        name: '_scaling_factor_token_x',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_scaling_factor_token_y',
        type: 'uint256',
      },
      {
        internalType: 'contract IERC20',
        name: '_token_x',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: '_token_y',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_admin_commission',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_marketmaker_commission',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_passive_order_payout',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_commission_scaling_factor',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_administrator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_pending_administrator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_marketmaker',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_should_invoke_on_trade',
        type: 'bool',
      },
      {
        internalType: 'uint64',
        name: '_nonce',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'order_id',
        type: 'uint64',
      },
    ],
    name: 'getOrderInfo',
    outputs: [
      {
        internalType: 'uint64',
        name: 'shares',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'value',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'payout_amount',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'address_',
        type: 'address',
      },
    ],
    name: 'getTraderBalance',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
