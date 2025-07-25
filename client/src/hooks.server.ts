import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/arcade/notify')) {
		throw redirect(302, '/arcade/notify');
	}
	const response = await resolve(event);
	return response;
};
