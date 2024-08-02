export const lobAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_trie_factory',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_tokenXAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_tokenYAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_supports_native_eth',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'scaling_token_x',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'scaling_token_y',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_administrator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_marketmaker',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_pauser',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_should_invoke_on_trade',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: '_admin_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_total_aggressive_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_total_passive_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_passive_order_payout_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'acceptOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'assembleOrderbookFromOrders',
    inputs: [
      {
        name: 'isAsk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'max_price_levels',
        type: 'uint24',
        internalType: 'uint24',
      },
    ],
    outputs: [
      {
        name: 'array_prices',
        type: 'uint56[]',
        internalType: 'uint56[]',
      },
      {
        name: 'array_shares',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'batchChangeOrder',
    inputs: [
      {
        name: 'order_ids',
        type: 'uint64[]',
        internalType: 'uint64[]',
      },
      {
        name: 'quantities',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
      {
        name: 'prices',
        type: 'uint56[]',
        internalType: 'uint56[]',
      },
      {
        name: 'max_commission_per_order',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'post_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'transfer_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'new_order_ids',
        type: 'uint64[]',
        internalType: 'uint64[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'batchClaim',
    inputs: [
      {
        name: 'addresses',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'order_ids',
        type: 'uint64[]',
        internalType: 'uint64[]',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'batchPlaceOrder',
    inputs: [
      {
        name: 'directions',
        type: 'bool[]',
        internalType: 'bool[]',
      },
      {
        name: 'quantities',
        type: 'uint128[]',
        internalType: 'uint128[]',
      },
      {
        name: 'prices',
        type: 'uint56[]',
        internalType: 'uint56[]',
      },
      {
        name: 'max_commission_per_order',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'post_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'transfer_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'new_order_ids',
        type: 'uint64[]',
        internalType: 'uint64[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'changeMarketMakerAddress',
    inputs: [
      {
        name: '_marketmaker',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_should_invoke_on_trade',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'changeOrder',
    inputs: [
      {
        name: 'old_order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'new_quantity',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'new_price',
        type: 'uint56',
        internalType: 'uint56',
      },
      {
        name: 'max_commission',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'post_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'transfer_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'changePauser',
    inputs: [
      {
        name: 'pauser_',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimOrder',
    inputs: [
      {
        name: 'order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'transfer_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'depositTokens',
    inputs: [
      {
        name: 'token_x_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'token_y_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'depositTokens',
    inputs: [
      {
        name: 'token_x_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'token_y_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'v_x',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r_x',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's_x',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'v_y',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r_y',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's_y',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'extractDirectionAndPrice',
    inputs: [
      {
        name: 'order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [
      {
        name: 'isAsk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'price',
        type: 'uint56',
        internalType: 'uint56',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'firstLevel',
    inputs: [],
    outputs: [
      {
        name: 'bid',
        type: 'uint56',
        internalType: 'uint56',
      },
      {
        name: 'ask',
        type: 'uint56',
        internalType: 'uint56',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAccumulatedFees',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getConfig',
    inputs: [],
    outputs: [
      {
        name: '_scaling_factor_token_x',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_scaling_factor_token_y',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_token_x',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_token_y',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_supports_native_eth',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: '_ask_trie',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_bid_trie',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_admin_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_total_aggressive_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_total_passive_commission_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_passive_order_payout_rate',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_should_invoke_on_trade',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderInfo',
    inputs: [
      {
        name: 'order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [
      {
        name: 'isAsk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'price',
        type: 'uint56',
        internalType: 'uint56',
      },
      {
        name: 'total_shares',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'remain_shares',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'payout_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'total_fee',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'current_execution_fee',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTraderBalance',
    inputs: [
      {
        name: 'address_',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'marketmaker',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonce',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pauser',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingOwner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'placeOrder',
    inputs: [
      {
        name: 'isAsk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'quantity',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'price',
        type: 'uint56',
        internalType: 'uint56',
      },
      {
        name: 'max_commission',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'market_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'post_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'transfer_executed_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'placeOrder',
    inputs: [
      {
        name: 'isAsk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'quantity',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'price',
        type: 'uint56',
        internalType: 'uint56',
      },
      {
        name: 'max_commission',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'amount_to_approve',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'market_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'post_only',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'transfer_executed_tokens',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'expires',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'v',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'order_id',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setClaimableStatus',
    inputs: [
      {
        name: 'status',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFees',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawTokens',
    inputs: [
      {
        name: 'withdraw_all',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'token_x_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'token_y_amount',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ClaimableStatusChanged',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'status',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposited',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token_x',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'token_y',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MarketMakerChanged',
    inputs: [
      {
        name: 'new_marketmaker',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'old_marketmaker',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderClaimed',
    inputs: [
      {
        name: 'order_id',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'token_x_sent',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'token_y_sent',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'passive_payout',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderPlaced',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'order_id',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'isAsk',
        type: 'bool',
        indexed: true,
        internalType: 'bool',
      },
      {
        name: 'price',
        type: 'uint56',
        indexed: false,
        internalType: 'uint56',
      },
      {
        name: 'passive_shares',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'passive_fee',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'aggressive_shares',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'aggressive_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'aggressive_fee',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferStarted',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PauserChanged',
    inputs: [
      {
        name: 'new_pauser',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'old_pauser',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdrawn',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'token_x',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'token_y',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AddressIsZero',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ArrayLengthMismatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ClaimNotAllowed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EnforcedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExcessiveSignificantFigures',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExpectedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Expired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Forbidden',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FractionalNumbersNotAllowed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientTokenXBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientTokenYBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidCommissionRate',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidFloatingPointRepresentation',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidMarketMaker',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidPriceRange',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTransfer',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketOnlyAndPostOnlyFlagsConflict',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MaxCommissionFailure',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NativeETHDisabled',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NonceExhaustedFailure',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OnlyOwnerCanCancelOrders',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeCastOverflowedUintDowncast',
    inputs: [
      {
        name: 'bits',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ZeroTokenTransferNotAllowed',
    inputs: [],
  },
] as const;
