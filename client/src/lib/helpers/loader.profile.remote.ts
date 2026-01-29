import { query } from '$app/server';
import { PUBLIC_API_SERVER } from '$env/static/public';
import * as v from 'valibot';
import { createToken } from './crypto';

export const remoteProfile = query(
	v.object({ profileid: v.string(), program: v.string() }),
	async ({ profileid, program }): Promise<App.InitData> => {
		const token = await createToken();
		const server = new URL(PUBLIC_API_SERVER + '/internal/identity/' + profileid);
		server.searchParams.append('program', program);
		if (program === 'juaragcp') server.searchParams.append('tokenize', 'false');
		const res = await fetch(server.href, {
			headers: { 'x-arcade-token': token, origin: 'https://skills.mantan.dev', useragent: 'mantab' }
		});
		const data: App.InitData = await res.json();
		return data;
	}
);
