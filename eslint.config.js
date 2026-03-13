import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}', 'mocks/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },

    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // Enforce using `import type` for type imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Disallow unused variables, but allow underscore-prefixed params as placeholders
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Require explicit return types on functions
      '@typescript-eslint/explicit-function-return-type': 'error',
      // Disallow unhandled promise rejections
      '@typescript-eslint/no-floating-promises': 'error',
      // Require explicit boolean conditions (but allow nullable types)
      '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableObject: true }],
      // Disallow unresolved imports (with exception for absolute paths)
      'import/no-unresolved': ['error', { ignore: ['^/'] }],
      // Prevent duplicate imports from the same module
      'import/no-duplicates': 'error',
      // Warn on console usage (should be removed before production)
      'no-console': 'warn',
      // Require const for variables that never change
      'prefer-const': 'error',
      // Ignore misused promises in void-returning contexts (e.g. event handlers), but enforce in other cases
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
])
