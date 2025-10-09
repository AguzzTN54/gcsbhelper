import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), devtoolsJson()],
	build: {
		sourcemap: true,
		chunkSizeWarningLimit: 350,
		target: ['es2020']
	}
});
