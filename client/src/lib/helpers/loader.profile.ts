import { PUBLIC_API_SERVER } from '$env/static/public';
import { createToken } from './crypto';
import { uuidToHex } from './uuid';

export interface LoadProfileOptions {
	profileUUID: string;
	program: string;
}

export const loadProfile = async (option: LoadProfileOptions) => {
	const { profileUUID, program } = option || {};
	const profileid = uuidToHex(profileUUID);
	const token = await createToken();
	const server = new URL(PUBLIC_API_SERVER + '/internal/identity/' + profileid);

	server.searchParams.append('program', program);
	if (program === 'juaragcp') server.searchParams.append('tokenize', 'false');

	const res = await fetch(server.href, { headers: { 'x-arcade-token': token } });
	if (res.status !== 200) throw new Error('Fetch Error');

	const data: App.InitData = await res.json();
	const { uuid } = data.user;
	if (!uuid) throw new Error('Missing ID');
	return data;
};

export const isGCSBUrl = (url: string) => {
	return /(cloudskillsboost.google|skills.google)\/public_profiles\//.test(url);
};

export const validateURL = (url: string) => {
	const pattern = new RegExp(
		'^([a-zA-Z]+:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', // fragment locator
		'i'
	);
	return pattern.test(url);
};

export const checkProfileEntities = async (uuid: string, program: string) => {
	const profileid = uuidToHex(uuid);
	const token = await createToken();
	const server = new URL(`${PUBLIC_API_SERVER}/internal/identity/${profileid}/verifyseason`);
	server.searchParams.append('program', program);
	const res = await fetch(server.href, { headers: { 'x-arcade-token': token } });
	if (res.status !== 200) throw new Error('Fetch Error');
	const data = await res.json();
	return data;
};

export const getRank = async (uuid: string, program: string) => {
	const profileid = uuidToHex(uuid);
	const token = await createToken();
	const server = new URL(`${PUBLIC_API_SERVER}/internal/identity/${profileid}/rank`);
	server.searchParams.append('program', program);
	const res = await fetch(server.href, { headers: { 'x-arcade-token': token } });
	if (res.status !== 200) throw new Error('Fetch Error');
	const data = await res.json();
	return data;
};
