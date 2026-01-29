import path from 'path';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		prerender: {
			origin: 'https://skills.mantan.dev'
		},
		alias: {
			$comp: path.resolve('./src/components'),
			$reusable: path.resolve('./src/routes/_global/reusable'),
			$img: path.resolve('./src/images')
		}
	},
	compilerOptions: {
		runes: true,
		experimental: {
			async: true
		}
	}
};

export default config;
