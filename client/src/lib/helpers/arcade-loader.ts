import { PUBLIC_API_SERVER, PUBLIC_PB_SERVER } from '$env/static/public';
import { initData } from '$lib/stores/app-store';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';
import { arcadeSeason, facilitatorPeriode } from '$lib/config';
import { createToken } from './crypto';
import { uuidToHex } from './uuid';

interface LoadProfileOptions {
	profileUUID: string;
	facilitator?: App.FacilitatorRegion;
	program: 'arcade' | 'juaragcp';
}

export const loadProfileAndBadges = async (option: LoadProfileOptions) => {
	const token = await createToken();
	const { courses, user } = await loadProfile(option, token);
	const storedBadges = await loadBadgeList(token, courses);
	const merged = badgeDataMerger(courses, storedBadges, option.facilitator);
	initData.set(merged);
	return { user, courses };
};

const loadProfile = async (option: LoadProfileOptions, token: string) => {
	const { profileUUID, program } = option || {};
	const profileid = uuidToHex(profileUUID);

	const server = new URL(PUBLIC_API_SERVER + '/internal/identity');
	if (option.program === 'arcade') {
		server.searchParams.append('program', `arcade_${arcadeSeason.seasonid}`);
		const { facilitator } = option;
		if (facilitator) server.searchParams.append('facilitator', facilitator);
	} else {
		server.searchParams.append('program', program);
	}

	const res = await fetch(server.href, {
		headers: { 'x-arcade-token': `${token}.${profileid}` }
	});
	if (res.status !== 200) throw new Error('Fetch Error');

	const data: { user: App.UserInfo; courses: App.UserCourses[] } = await res.json();
	const { uuid } = data.user;
	if (!uuid) throw new Error('Missing ID');
	return data;
};

interface PBItem extends App.CourseItem {
	collectionId: string;
	collectionName: string;
	id: string;
	created: string;
	updated: string;
}

const loadBadgeList = async (token: string, courses: App.UserCourses[]): Promise<PBItem[]> => {
	const cids = courses.filter((c) => c.type === 'skill').map((c) => `courseid=${c.courseid}`);
	const bids = courses.filter((b) => b.type === 'game').map((c) => `badgeid=${c.courseid}`);
	const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
	const filteridStr = filterid ? `|| (${filterid})` : '';
	const url = new URL(PUBLIC_PB_SERVER + '/api/collections/courses/records');
	url.searchParams.append('perPage', '200');
	url.searchParams.append('filter', `((inactive=false && type != null)${filteridStr})`);

	const res = await fetch(url.href, {
		headers: { 'x-arcade-token': token }
	});
	const data = await res.json();
	return data?.items || [];
};

const badgeDataMerger = (
	profileBadges: App.UserCourses[],
	pbBadges: PBItem[],
	facilitator?: App.FacilitatorRegion
): App.CourseItem[] => {
	const map = new Map<number, App.CourseItem>();
	for (const { type, title, badgeurl, date, courseid } of profileBadges) {
		const course: App.CourseItem = {
			title,
			type,
			badgeid: type == 'game' ? courseid : 0,
			courseid: type == 'game' ? 0 : courseid,
			badgeurl: badgeurl,
			earndate: date,
			earned: false,
			fasttrack: false,
			inactive: false,
			level: '',
			point: 0,
			token: '',
			totallab: 0
		};
		map.set(courseid, course);
	}

	for (const { collectionId, collectionName, id, created, updated, ...obj } of pbBadges) {
		const key = obj.badgeid || obj.courseid;
		if (!map.has(key)) {
			map.set(key, { ...obj, earned: false });
			continue;
		}

		const { earndate } = map.get(key)!;
		map.set(key, {
			...obj,
			earndate,
			earned: true,
			validity: validateBadge(earndate, facilitator)
		});
	}

	return Array.from(map.values());
};

type BadgeValidity = { arcade: boolean; facilitator: boolean };
const validateBadge = (
	earndate?: string | Date | Dayjs,
	facilitator?: App.FacilitatorRegion
): BadgeValidity => {
	if (!earndate) return { arcade: false, facilitator: false };

	const { end: aEnd, start: aStart } = arcadeSeason;
	const arcadeValidity = !dayjs(earndate).isBefore(aStart) && !dayjs(earndate).isAfter(aEnd);

	if (!facilitator || facilitator === 'unset') {
		return {
			arcade: arcadeValidity,
			facilitator: false
		};
	}

	const { end, start } = facilitatorPeriode[facilitator] || {};
	return {
		arcade: arcadeValidity,
		facilitator: !dayjs(earndate).isBefore(start) && !dayjs(earndate).isAfter(end)
	};
};
