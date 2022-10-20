module.exports = {
    singleQuote: true,
    tabWidth: 4,
    semi: true,
    trailingComma: 'all',
    printWidth: 120,
    overrides: [
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
                singleQuote: true,
            },
        },
    ],
};
