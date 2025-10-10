import { dev } from '$app/environment';
import { PUBLIC_GITHUB_SHA, PUBLIC_OPR_PROJECT_KEY } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';
import Tracker from '@openreplay/tracker';

let sessionId = '';
let sessionURL = '';

const beforeSendHandler = async (event: Sentry.ErrorEvent) => {
	await window.__opr?.start();
	const sid = window.__opr?.getSessionID();
	const sURL = window.__opr?.getSessionURL();
	if (sid) sessionId = sid;
	if (sURL) sessionURL = sURL;

	event.tags = { ...event.tags, ...(sessionId ? { openReplaySessionId: sessionId } : {}) };
	event.extra = { ...event.extra, ...(sessionURL ? { openReplaySessionURL: sessionURL } : {}) };
	afterSendHandler();
	return event;
};

let timer: ReturnType<typeof setTimeout> | undefined;
const afterSendHandler = () => {
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		clearTimeout(timer);
		window.__opr?.stop();
		window.__opr?.coldStart();
	}, 5000);
};

if (!dev) {
	Sentry.init({
		dsn: 'https://14b346460db44b43941ba39d3e7e9388@sink.mantan.dev/1',
		sendDefaultPii: true,
		tracesSampleRate: 9.0,
		enableLogs: true,
		environment: dev ? 'development' : 'production',
		release: 'gcsb-helper@' + PUBLIC_GITHUB_SHA,
		integrations: [Sentry.httpClientIntegration(), Sentry.browserTracingIntegration()],
		beforeSend: async (event) => {
			const result = await beforeSendHandler(event);
			return result;
		},

		beforeSendTransaction: async (event) => {
			await beforeSendHandler(event as unknown as Sentry.ErrorEvent);
			return event;
		}
	});

	window.__opr = new Tracker({
		projectKey: PUBLIC_OPR_PROJECT_KEY,
		ingestPoint: 'https://opr.mantan.dev/ingest',
		revID: 'gcsb-helper@' + PUBLIC_GITHUB_SHA,
		respectDoNotTrack: true,
		__DISABLE_SECURE_MODE: dev || window.location.hostname === 'localhost'
	});
	window.__opr?.coldStart();
}

const errorhandler: HandleClientError = async (error) => {
	const errorId = crypto.randomUUID();
	return { ...error, errorId };
};

export const handleError: HandleClientError = Sentry.handleErrorWithSentry(errorhandler);
