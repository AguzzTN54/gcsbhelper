import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { plugin as MdPlugin } from 'vite-plugin-markdown';

export default defineConfig({
	plugins: [sveltekit(), MdPlugin({ mode: 'markdown' })],
	resolve: {
		alias: {
			$comp: path.resolve(__dirname, './src/components'),
			$post: path.resolve(__dirname, './src/post')
		}
	},
	build: {
		chunkSizeWarningLimit: 350,
		target: ['es2020']
	}
});
