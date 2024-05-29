export const lobAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_tokenXAddress', type: 'address', internalType: 'address' },
      { name: '_tokenYAddress', type: 'address', internalType: 'address' },
      { name: 'scaling_token_x', type: 'uint256', internalType: 'uint256' },
      { name: 'scaling_token_y', type: 'uint256', internalType: 'uint256' },
      { name: '_administrator', type: 'address', internalType: 'address' },
      { name: '_marketmaker', type: 'address', internalType: 'address' },
      { name: '_should_invoke_on_trade', type: 'bool', internalType: 'bool' },
      { name: '_admin_commission', type: 'uint128', internalType: 'uint128' },
      { name: '_marketmaker_commission', type: 'uint128', internalType: 'uint128' },
      { name: '_passive_order_payout', type: 'uint128', internalType: 'uint128' },
      { name: '_commission_scaling_factor', type: 'uint128', internalType: 'uint128' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'batchChangeOrder',
    inputs: [
      { name: 'order_ids', type: 'uint64[]', internalType: 'uint64[]' },
      { name: 'quantities', type: 'uint64[]', internalType: 'uint64[]' },
      { name: 'prices', type: 'uint24[]', internalType: 'uint24[]' },
      { name: 'post_only', type: 'bool', internalType: 'bool' },
      { name: 'transfer_tokens', type: 'bool', internalType: 'bool' }
    ],
    outputs: [{ name: 'new_order_ids', type: 'uint64[]', internalType: 'uint64[]' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'batchClaim',
    inputs: [
      { name: 'addresses', type: 'address[]', internalType: 'address[]' },
      { name: 'order_ids', type: 'uint64[]', internalType: 'uint64[]' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'batchPlaceOrder',
    inputs: [
      { name: 'directions', type: 'bool[]', internalType: 'bool[]' },
      { name: 'quantities', type: 'uint64[]', internalType: 'uint64[]' },
      { name: 'prices', type: 'uint24[]', internalType: 'uint24[]' },
      { name: 'post_only', type: 'bool', internalType: 'bool' },
      { name: 'transfer_tokens', type: 'bool', internalType: 'bool' }
    ],
    outputs: [{ name: 'new_order_ids', type: 'uint64[]', internalType: 'uint64[]' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'changeMarketMakerAddress',
    inputs: [{ name: '_marketmaker', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'changeOrder',
    inputs: [
      { name: 'old_order_id', type: 'uint64', internalType: 'uint64' },
      { name: 'new_quantity', type: 'uint64', internalType: 'uint64' },
      { name: 'new_price', type: 'uint24', internalType: 'uint24' },
      { name: 'post_only', type: 'bool', internalType: 'bool' },
      { name: 'transfer_tokens', type: 'bool', internalType: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'claimOrder',
    inputs: [
      { name: 'order_id', type: 'uint64', internalType: 'uint64' },
      { name: 'transfer_tokens', type: 'bool', internalType: 'bool' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositTokens',
    inputs: [
      { name: 'token_x_amount', type: 'uint64', internalType: 'uint64' },
      { name: 'token_y_amount', type: 'uint64', internalType: 'uint64' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'firstLevel',
    inputs: [],
    outputs: [
      { name: 'bid', type: 'uint24', internalType: 'uint24' },
      { name: 'ask', type: 'uint24', internalType: 'uint24' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getConfig',
    inputs: [],
    outputs: [
      { name: '_scaling_factor_token_x', type: 'uint256', internalType: 'uint256' },
      { name: '_scaling_factor_token_y', type: 'uint256', internalType: 'uint256' },
      { name: '_token_x', type: 'address', internalType: 'contract IERC20' },
      { name: '_token_y', type: 'address', internalType: 'contract IERC20' },
      { name: '_admin_commission', type: 'uint256', internalType: 'uint256' },
      { name: '_marketmaker_commission', type: 'uint256', internalType: 'uint256' },
      { name: '_passive_order_payout', type: 'uint256', internalType: 'uint256' },
      { name: '_commission_scaling_factor', type: 'uint256', internalType: 'uint256' },
      { name: '_administrator', type: 'address', internalType: 'address' },
      { name: '_marketmaker', type: 'address', internalType: 'address' },
      { name: '_should_invoke_on_trade', type: 'bool', internalType: 'bool' },
      { name: '_nonce', type: 'uint64', internalType: 'uint64' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getOrderInfo',
    inputs: [{ name: 'order_id', type: 'uint64', internalType: 'uint64' }],
    outputs: [
      { name: 'shares', type: 'uint64', internalType: 'uint64' },
      { name: 'value', type: 'uint64', internalType: 'uint64' },
      { name: 'payout_amount', type: 'uint64', internalType: 'uint64' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTraderBalance',
    inputs: [{ name: 'address_', type: 'address', internalType: 'address' }],
    outputs: [
      { name: '', type: 'uint64', internalType: 'uint64' },
      { name: '', type: 'uint64', internalType: 'uint64' },
      { name: '', type: 'bool', internalType: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'placeOrder',
    inputs: [
      { name: 'isAsk', type: 'bool', internalType: 'bool' },
      { name: 'quantity', type: 'uint64', internalType: 'uint64' },
      { name: 'price', type: 'uint24', internalType: 'uint24' },
      { name: 'market_only', type: 'bool', internalType: 'bool' },
      { name: 'post_only', type: 'bool', internalType: 'bool' },
      { name: 'transfer_executed_tokens', type: 'bool', internalType: 'bool' }
    ],
    outputs: [{ name: 'order_id', type: 'uint64', internalType: 'uint64' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setClaimableStatus',
    inputs: [{ name: 'status', type: 'bool', internalType: 'bool' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawTokens',
    inputs: [
      { name: 'withdraw_all', type: 'bool', internalType: 'bool' },
      { name: 'token_x_amount', type: 'uint64', internalType: 'uint64' },
      { name: 'token_y_amount', type: 'uint64', internalType: 'uint64' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'ClaimOrderEvent',
    inputs: [
      { name: 'order_id', type: 'uint64', indexed: false, internalType: 'uint64' },
      { name: 'token_x_sent', type: 'uint64', indexed: false, internalType: 'uint64' },
      { name: 'token_y_sent', type: 'uint64', indexed: false, internalType: 'uint64' },
      { name: 'passive_payout', type: 'uint64', indexed: false, internalType: 'uint64' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'MarketOrderEvent',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'isAsk', type: 'bool', indexed: true, internalType: 'bool' },
      { name: 'price', type: 'uint24', indexed: false, internalType: 'uint24' },
      { name: 'quantity', type: 'uint64', indexed: false, internalType: 'uint64' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PlaceOrderEvent',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'order_id', type: 'uint64', indexed: false, internalType: 'uint64' },
      { name: 'isAsk', type: 'bool', indexed: true, internalType: 'bool' },
      { name: 'price', type: 'uint24', indexed: false, internalType: 'uint24' },
      { name: 'quantity', type: 'uint64', indexed: false, internalType: 'uint64' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'SetClaimableStatusEvent',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'status', type: 'bool', indexed: false, internalType: 'bool' }
    ],
    anonymous: false
  },
  { type: 'error', name: 'AddressEmptyCode', inputs: [{ name: 'target', type: 'address', internalType: 'address' }] },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'ArrayLengthMismatch', inputs: [] },
  { type: 'error', name: 'ClaimstatusDoesntAllowNonOwnerClaims', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'Forbidden', inputs: [] },
  { type: 'error', name: 'InsufficientTokenXBalance', inputs: [] },
  { type: 'error', name: 'InsufficientTokenYBalance', inputs: [] },
  { type: 'error', name: 'MarketOnlyAndPostOnlyFlagsConflict', inputs: [] },
  { type: 'error', name: 'NonceExhaustedFailure', inputs: [] },
  { type: 'error', name: 'OnlyOwnerCanCancelOrders', inputs: [] },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }]
  },
  { type: 'error', name: 'UnknownTrader', inputs: [] },
  { type: 'error', name: 'ZeroTokenTransferNotAllowed', inputs: [] }
] as const;
