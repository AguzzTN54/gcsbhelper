import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sentryUrl: 'https://72efb29fcfa6497cb626eecc4a7f06e3@sink.wishsimulator.app',
			authToken: '5ee893d7fd1c420ad616428b6374af44e435cceffa9524f566e84bfeb255a65a',
			bundleSizeOptimizations: {
				excludeReplayIframe: true,
				excludeReplayShadowDom: true,
				excludeReplayWorker: true
			},
			sourcemaps: {
				filesToDeleteAfterUpload: ['./build/_app/immutable/**/*.map']
			},
			project: 'skillboost-helper-sink',
			org: 'ekrafdev'
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
