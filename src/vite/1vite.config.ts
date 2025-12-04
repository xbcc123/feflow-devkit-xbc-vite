import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const config: UserConfig = {
		plugins: [
			vue(),
			vueJsx(),
		],
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'vue': 'vue/dist/vue.esm.js',
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.cjs'],
		},
		server: {
			port: 3040,
			open: true,
			proxy: mode === 'development' ? {
				'/api': {
					target: 'http://192.168.16.23:31057',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			} : undefined,
		},
		build: {
			outDir: 'dist',
			assetsDir: 'static',
			sourcemap: false,
			commonjsOptions: {
				include: [/node_modules/],
				transformMixedEsModules: true,
			},
			rollupOptions: {
				output: {
					chunkFileNames: 'static/js/[name].[hash].js',
					entryFileNames: 'static/js/[name].[hash].js',
					assetFileNames: 'static/[ext]/[name].[hash].[ext]',
					manualChunks: {
						'vue-vendor': ['vue', 'vue-router', 'vuex'],
						'ant-design': ['ant-design-vue'],
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
				},
			},
		},
		optimizeDeps: {
			include: ['vue', 'ant-design-vue', 'vue-router', 'vuex', 'moment', 'lodash', 'axios'],
			esbuildOptions: {
				define: {
					global: 'globalThis',
				},
			},
		},
		define: {
			'process.env': {},
			'API_HOST': JSON.stringify(
				mode === 'development'
					? 'http://192.168.16.23:31057'
					: '/api'
			),
			'API_IMG': JSON.stringify(
				mode === 'development'
					? 'http://192.168.16.8:30029/'
					: '/image/'
			),
			'API_HOST_WWW': JSON.stringify('/api'),
			'API_IMG_WWW': JSON.stringify('/image/'),
			'MODE': JSON.stringify(mode),
		},
	};

	return config;
});
