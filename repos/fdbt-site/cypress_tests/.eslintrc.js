module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    root: true,
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'eslint-config-prettier',
        'plugin:cypress/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: `./tsconfig.json`,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: [0, 4],
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksConditionals: false,
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
};
