import { createToken } from "./crypto";
import { uuidToHex } from "./uuid";

const cors_host = [
	// 'https://cors.eu.org/',
	// 'https://api.allorigins.win/raw?url=',
	'https://cors-get-proxy.sirjosh.workers.dev/?url=',
	// 'https://cors-proxy.fringe.zone/',
	'https://api.wishsimulator.app/gcsb?u='
];

interface ProfileResult {
	error: boolean;
	data?: App.ProfileData;
}
export const loadProfile = async (profileURL: string): Promise<ProfileResult> => {
	try {
		const profileID = getProfileID(profileURL);
		const x = await fetch('https://gcsbserver.deno.dev/api/identity/' + uuidToHex(profileID), {
			headers: { 'x-subscribe-token': await createToken() }
		})
		const data = await x.json()
		return { error: false, data };
	} catch (e) {
		console.error(e);
		return { error: true };
	}
};

// const parser = (txtHTML: string) => {
// 	const tmpEl = document.createElement('section');
// 	tmpEl.innerHTML = txtHTML;

// 	const courses = [] as App.UserCourses[];
// 	const badges = tmpEl.querySelectorAll('.profile-badge');
// 	badges.forEach((badgeEl) => {
// 		const dateEl = badgeEl.querySelector('.ql-body-medium.l-mbs');
// 		const [, dateTxt] = dateEl?.textContent?.split('Earned') || [];
// 		const date = dateTxt.trim();

// 		const learnBTN = badgeEl.querySelector('ql-button');
// 		const modalID = learnBTN?.getAttribute('modal') || '';
// 		const modalElement = tmpEl.querySelector(`#${modalID}`);
// 		const courseName = modalElement?.getAttribute('headline') || '';

// 		const qlButton = modalElement?.querySelector('ql-button');
// 		const href = qlButton?.getAttribute('href');
// 		if (!href) return null;
// 		const [, , id] = href.split('/');
// 		const courseID = parseInt(id, 10);

// 		const itemData = { courseName, courseID, date };
// 		courses.push(itemData);
// 	});

// 	const user = tmpEl.querySelector('h1')?.textContent?.trim() || '';
// 	return { user, courses };
// };

// export const fetchOfficial = async (profileURL: string) => {
// 	const profileID = getProfileID(profileURL);
// 	if (!profileID) return null;

// 	try {
// 		const dbURL = `https://api.wishsimulator.app/gcsb?profile=${profileID}`;
// 		const resource = await fetch(dbURL);
// 		const data = await resource.json();
// 		return { error: false, data: { ...data, profileID, official: true } };
// 	} catch (e) {
// 		console.error(e);
// 		return { error: true, data: {} };
// 	}
// };

const getProfileID = (profileURL: string) => {
	const url = new URL(profileURL);
	const [, , profileID] = url.pathname.split('/');
	return profileID;
};
