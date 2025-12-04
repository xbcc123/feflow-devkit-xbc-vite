import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import { resolve } from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const projectRoot = process.cwd();

export default defineConfig(({ mode }) => {
    return {
        root: projectRoot,
        publicDir: resolve(projectRoot, "static"),
        resolve: {
            extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
            alias: {
                "@": resolve(projectRoot, "src"),
            },
        },
        plugins: [
            vue({
                jsx: true,
                include: [/\.vue$/, /\.jsx$/],
            }),
            vueJsx({
                include: [/\.jsx$/, /\.tsx$/],
            }),
        ],
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
        },
        // build: {
        //     outDir: resolve(projectRoot, "dist"),
        //     assetsDir: "static",
        //     sourcemap: false,
        //     rollupOptions: {
        //         output: {
        //             chunkFileNames: "static/js/[name].[hash].js",
        //             entryFileNames: "static/js/[name].[hash].js",
        //             assetFileNames: "static/[ext]/[name].[hash].[ext]",
        //             manualChunks: {
        //                 "vue-vendor": ["vue", "vue-router", "vuex"],
        //             },
        //         },
        //     },
        // },
        server: {
            host: "0.0.0.0",
            port: 8080,
            open: true,
            cors: true,
        },
        // define: {
        //     "process.env": {},
        // },
    };
});
