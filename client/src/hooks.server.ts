import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (response.status === 404) {
		throw redirect(307, '/404');
	}
	return response;
};
