import { dev } from '$app/environment';
import { PUBLIC_GITHUB_SHA } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://72efb29fcfa6497cb626eecc4a7f06e3@sink.wishsimulator.app/1',
	sendDefaultPii: true,
	tracesSampleRate: 1.0,
	enableLogs: true,
	environment: dev ? 'development' : 'production',
	release: 'gcsb-helper@' + PUBLIC_GITHUB_SHA,
	integrations: [Sentry.httpClientIntegration(), Sentry.browserTracingIntegration()]
});

const errorhandler: HandleClientError = async (error) => {
	const errorId = crypto.randomUUID();
	return { ...error, errorId };
};

export const handleError: HandleClientError = Sentry.handleErrorWithSentry(errorhandler);
