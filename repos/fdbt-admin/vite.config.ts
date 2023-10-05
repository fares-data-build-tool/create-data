// https://vitejs.dev/config/
import { defineConfig } from 'vite';

// Config is based on metaplex + vite example from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            process: 'process/browser',
            buffer: 'buffer/',
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            assert: 'assert',
            http: 'stream-http',
            https: 'https-browserify',
            os: 'os-browserify',
            url: 'url',
            util: 'rollup-plugin-node-polyfills/polyfills/util',
        },
    },
    define: {
        'process.env': process.env ?? {},
        ...(process.env.NODE_ENV === 'development' ? { global: {} } : {}),
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
        },
    },
    server: {
        port: 3000,
    },
});
