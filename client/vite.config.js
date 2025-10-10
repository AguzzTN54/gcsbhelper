import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sentryUrl: 'https://14b346460db44b43941ba39d3e7e9388@sink.mantan.dev',
			authToken: 'ebdc849317a4a63604689ba0562be794730f8d4b4f557f8590496226bc8a930b',
			bundleSizeOptimizations: {
				excludeReplayIframe: true,
				excludeReplayShadowDom: true,
				excludeReplayWorker: true
			},
			sourcemaps: {
				// filesToDeleteAfterUpload: ['./build/_app/immutable/**/*.map']
			},
			project: 'gcsb-helpers',
			org: 'mantan-dev'
		}),
		sveltekit(),
		tailwindcss(),
		devtoolsJson()
	],
	build: {
		sourcemap: true,
		chunkSizeWarningLimit: 350,
		target: ['es2020']
	}
});
