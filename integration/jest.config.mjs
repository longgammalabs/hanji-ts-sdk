import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const currentWorkingDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentWorkingDirectory, './.env.local') });
dotenv.config({ path: path.resolve(currentWorkingDirectory, './.env') });

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  testTimeout: Number.parseInt(process.env.JEST_TIMEOUT),
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
};
