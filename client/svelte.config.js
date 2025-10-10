import path from 'path';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		prerender: {
			origin: 'https://gcsbhelper.pages.dev'
		},
		adapter: adapter(),
		alias: {
			$comp: path.resolve('./src/components'),
			$reusable: path.resolve('./src/routes/_global/reusable'),
			$img: path.resolve('./src/images')
		}
	}
};

export default config;
