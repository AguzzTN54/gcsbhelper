import { PUBLIC_API_SERVER } from '$env/static/public';
import { arcadeSeason } from '$lib/config';
import { fetchedProfile } from '$lib/stores/app-store';
import { createToken } from './crypto';
import { uuidToHex } from './uuid';

type LoadProfileOptions = { profileUUID: string } & (
	| { facilitator?: App.FacilitatorRegion; program: 'arcade' }
	| { program: 'juaragcp' }
);

export const loadProfile = async (option: LoadProfileOptions) => {
	const { profileUUID, program } = option || {};
	const profileid = uuidToHex(profileUUID);
	const token = await createToken();

	const server = new URL(PUBLIC_API_SERVER + '/internal/identity');
	if (option.program === 'arcade') {
		server.searchParams.append('program', `arcade_${arcadeSeason}`);
		const { facilitator } = option;
		if (facilitator) server.searchParams.append('facilitator', facilitator);
	} else {
		server.searchParams.append('program', program);
	}

	const res = await fetch(server.href, {
		headers: { 'x-arcade-token': `${token}#${profileid}` }
	});
	if (res.status !== 200) throw new Error('Fetch Error');

	const data: App.FetchedProfile = await res.json();
	const { profileid: uuid } = data.user;
	if (!uuid) throw new Error('Missing ID');
	fetchedProfile.set(data);
	return data;
};
