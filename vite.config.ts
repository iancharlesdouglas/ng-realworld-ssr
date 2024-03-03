/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
	plugins: [
		angular(),
		viteTsConfigPaths({
			root: './',
		}),
	],
	test: {
		globals: true,
		setupFiles: ['src/test.ts'],
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			provider: 'v8',
			exclude: [
				'src/**/model/**/*.ts',
				'src/main.server.ts',
				'src/main.ts',
				'src/environments/environment.prod.ts',
				'src/**/app.routes.ts',
				'src/**/*.config*.ts',
				'functions/src/*',
				'ng-realworld-ssr/node_modules/**/*',
				'*.d.ts',
				'server.ts',
				'**/*.js',
			],
		},
	},
	define: {
		'import.meta.vitest': mode !== 'production',
	},
}));
