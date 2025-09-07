import { PUBLIC_PB_SERVER } from '$env/static/public';
import PocketBase from 'pocketbase';

const pb = new PocketBase(PUBLIC_PB_SERVER);
pb.beforeSend = (url, options) => {
	options.headers = Object.assign({}, options.headers, {
		'X-Arcade-Token': 'token'
	});
	return { url, options };
};

export const login = (token: string) => {
	pb.authStore.save(token);
	return pb.authStore.isValid;
};

export default pb;
