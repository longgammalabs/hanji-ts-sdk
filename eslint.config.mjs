// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: 'tsconfig.eslint.json',
          tsconfigRootDir: import.meta.dirname,

        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-declaration-merging': 'off',
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: [
        'scripts/**/*.js',
        'scripts/**/*.mjs',
      ],
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      files: [
        '**/jest.config.js',
        '**/jest.config.ts',
        '**/jest.config.mjs',
        '**/tests/**/*.js',
        '**/tests/**/*.ts',
        '**/tests/**/*.mts',
        '**/tests/**/*.mjs',
      ],
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },
    {
      ignores: [
        'dist/**/*',
      ],
    }
  ),
  stylistic.configs.customize({
    quotes: 'single',
    indent: 2,
    semi: true,
    jsx: true,
  }),
  {
    rules: {
      '@stylistic/indent': ['warn', 2, {
        flatTernaryExpressions: true,
        offsetTernaryExpressions: false,
        SwitchCase: 1,
      }],
      '@stylistic/comma-dangle': ['warn', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      }],
      '@stylistic/arrow-parens': ['warn', 'as-needed'],
    },
  },
];
