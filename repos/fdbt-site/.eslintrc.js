module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'eslint-config-prettier',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: `./tsconfig.json`,
    },
    plugins: ['react', '@typescript-eslint', 'jsx-a11y', 'jest'],
    rules: {
        'jest/no-disabled-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error',
        indent: [
            0,
            4,
            {
                ignoredNodes: [
                    'JSXElement',
                    'JSXElement > *',
                    'JSXAttribute',
                    'JSXIdentifier',
                    'JSXNamespacedName',
                    'JSXMemberExpression',
                    'JSXSpreadAttribute',
                    'JSXExpressionContainer',
                    'JSXOpeningElement',
                    'JSXClosingElement',
                    'JSXText',
                    'JSXEmptyExpression',
                    'JSXSpreadChild',
                ],
                SwitchCase: 1,
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
            },
        ],
        // TODO - review these new rules when bumping lint versions
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',

        '@typescript-eslint/no-unused-expressions': ['error'],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
        'react/jsx-indent': [0, 4],
        'react/require-default-props': 'off',
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                assert: 'htmlFor',
            },
        ],
        'func-style': [2, 'expression'],
        curly: [2, 'all'],
        '@typescript-eslint/unbound-method': 0,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
