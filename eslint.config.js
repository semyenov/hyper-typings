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
