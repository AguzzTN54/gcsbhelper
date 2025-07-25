import { PUBLIC_API_SERVER } from '$env/static/public';
export const load = async ({ fetch }) => {
	try {
		const res = await fetch(PUBLIC_API_SERVER + '/api/getToken', {
			headers: {
				'User-Agent': 'AgusIkiBos',
				origin: 'https://gcsbhelper.pages.dev'
			}
		});
		const data: { token: string } = await res.json();
		return data;
	} catch (e) {
		console.error(e);
		return { token: '' };
	}
};
