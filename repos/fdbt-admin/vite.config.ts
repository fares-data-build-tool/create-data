// https://vitejs.dev/config/
import { defineConfig } from 'vite';

// Config is based on metaplex + vite example from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

export default defineConfig({
    plugins: [],
    define: {
        'process.env': process.env ?? {},
        global: 'globalThis',
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
