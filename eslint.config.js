/* eslint-disable */
import globals from 'globals';

import path from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import pluginJs from '@typescript-eslint/eslint-plugin';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	extends: 'eslint:recommended',
	baseDirectory: __dirname,
	recommendedConfig: {
		...pluginJs.configs.recommended,
		rules: {
			...pluginJs.configs.recommended.rules,
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/indent': ['off', 2],
			'indent': ['error', 2],
		},
	},
});

export default [
	{files: ['**/*.ts'], languageOptions: {sourceType: 'script'}},
	{languageOptions: {globals: globals.browser}},
	...compat.extends('xo-typescript'),
];

import config from '@sozdev/eslint-config'
import eslintPluginStylisticTs from '@stylistic/eslint-plugin-ts'

/** @type {import('eslint').Linter.FlatConfig} */
const schema = [
  ...config,
  {
    plugins: {
      '@stylistic/ts': eslintPluginStylisticTs,
    },
    rules: {
      // General
      'eslint-comments/no-unlimited-disable': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-use-before-define': ['error', { functions: false }],
      'no-param-reassign': ['error', { props: false }],
      'no-underscore-dangle': ['error', { allow: ['_id', '_count'] }],
      'no-shadow': ['error', { allow: ['_id', '_count'] }],
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-shadow-restricted-names': ['error'],
      "unused-imports/no-unused-imports": ["warn"],

      // Stylistic
      'curly': ['error', 'all'],
      'newline-before-return': ['error'],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      'multiline-ternary': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always'],
    },
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  },
]

export default schema
