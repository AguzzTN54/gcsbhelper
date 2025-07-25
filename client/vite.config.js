import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { plugin as MdPlugin } from 'vite-plugin-markdown';

export default defineConfig({
	// @ts-ignore
	plugins: [sveltekit(), MdPlugin({ mode: 'markdown' })],
	build: {
		chunkSizeWarningLimit: 350,
		target: ['es2020']
	}
});
