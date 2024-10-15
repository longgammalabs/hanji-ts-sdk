import { expect } from '@jest/globals';
import { convertTokensRawAmountToAmount, convertTokensAmountToRawAmount } from './tokenUtils';
import BigNumber from 'bignumber.js';

describe('Convert raw amount to amount', () => {
  test('Convert string', () => {
    const result = convertTokensRawAmountToAmount('12345643', 6);
    expect(result).toBeInstanceOf(BigNumber);
    expect(result).toEqual(BigNumber('12.345643'));
  });

  test('Convert bigint', () => {
    const result = convertTokensRawAmountToAmount(12345643n, 6);
    expect(result).toBeInstanceOf(BigNumber);
    expect(result).toEqual(BigNumber('12.345643'));
  });
});

describe('Convert amount to raw amount', () => {
  test.each([
    [BigNumber('1.2345678'), 1234567n],
    [BigNumber('1.2345671'), 1234567n],
  ])('Omit precision', (amount, expected) => {
    const result = convertTokensAmountToRawAmount(amount, 6);
    expect(result).toBe(expected);
  });
});
