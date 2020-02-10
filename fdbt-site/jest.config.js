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
    setupFilesAfterEnv: ['<rootDir>/setupEnzyme.ts'],
    coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
    moduleNameMapper: {
        '\\.(css|sass|scss|png|ico)$': 'identity-obj-proxy',
    },
    snapshotSerializers: ['enzyme-to-json/serializer'],
};
