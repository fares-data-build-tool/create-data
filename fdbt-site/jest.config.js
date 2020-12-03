module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/*.(test|spec).(ts|tsx)'],
    globals: {
        'ts-jest': {
            babelConfig: true,
            tsConfig: 'jest.tsconfig.json',
            diagnostics: false,
        },
    },

    coveragePathIgnorePatterns: ['/node_modules/', 'enzyme.js'],
    setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setupEnzyme.ts'],
    coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
    moduleNameMapper: {
        '\\.(css|sass|scss|png|ico)$': 'identity-obj-proxy',
    },
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleNameMapper: {
        '\\.(csv|ico|png|pdf)$': '<rootDir>/__mocks__/fileMock.js',
    },
};
