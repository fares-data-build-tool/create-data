import { defineConfig } from 'cypress';

export default defineConfig({
    retries: 3,
    numTestsKeptInMemory: 0,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return require('./cypress/plugins/index.js')(on, config);
        },
        baseUrl: 'http://localhost:5555',
    },
});
