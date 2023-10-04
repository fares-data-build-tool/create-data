module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}"
    ],
    testMatch: ['**/*.(test|spec).(ts|tsx)'],
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
