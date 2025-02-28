module.exports = {
  env: {
      es6: true,
      node: true,
      jest: true,
  },
  extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'eslint-config-prettier',
  ],
  globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
      'jest/no-disabled-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unused-vars': [
          'error',
          {
              vars: 'all',
              args: 'after-used',
              ignoreRestSiblings: false,
          },
      ],
      'no-console': 0,
  },
  settings: {
      'import/resolver': {
          node: {
              extensions: ['.js', '.ts'],
          },
      },
  },
};
