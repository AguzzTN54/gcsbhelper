import { dev } from '$app/environment';
import { PUBLIC_GITHUB_SHA, PUBLIC_OPR_PROJECT_KEY } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';
import Tracker from '@openreplay/tracker';

window.__opr = new Tracker({
	projectKey: PUBLIC_OPR_PROJECT_KEY,
	ingestPoint: 'https://sink.mantan.dev/ingest',
	revID: 'gcsb-helper@' + PUBLIC_GITHUB_SHA,
	respectDoNotTrack: true,
	__DISABLE_SECURE_MODE: dev || window.location.hostname === 'localhost'
});

if (!dev) {
	window.addEventListener('unhandledrejection', (error) => {
		window.__opr?.handleError(error);
		window.__opr?.start();
	});
	window.addEventListener('error', (error) => {
		window.__opr?.handleError(error);
		window.__opr?.start();
	});
}

const isPromiseRejectionEvent = (v: unknown): v is PromiseRejectionEvent => {
	return v instanceof PromiseRejectionEvent;
};

const isErrorEvent = (v: unknown): v is ErrorEvent => {
	return v instanceof ErrorEvent;
};

const isError = (v: unknown): v is Error => {
	return v instanceof Error;
};

export const handleError: HandleClientError = async (error) => {
	const errorId = crypto.randomUUID();
	const val = error.error;
	if (isError(val) || isErrorEvent(val) || isPromiseRejectionEvent(val)) {
		window.__opr?.handleError(val);
	} else {
		window.__opr?.handleError(new Error(String(val)));
	}
	return { ...error, errorId };
};
