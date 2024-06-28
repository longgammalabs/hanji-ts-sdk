export const transactionRegex = /^0x[0-9a-f]{64}$/;

export const expectTransactionHashMatching = expect.stringMatching(transactionRegex);
