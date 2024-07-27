import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$comp: path.resolve(__dirname, './src/components'),
			$post: path.resolve(__dirname, './src/post')
		}
	}
});
