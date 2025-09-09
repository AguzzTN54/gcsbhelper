import { PUBLIC_API_SERVER } from '$env/static/public';
import { activeProfile, incompleteCalculation, initData } from '$lib/stores/app-store';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';
import pb, { login } from '$lib/helpers/pocketbase';
import { arcadeSeason, facilitatorPeriode } from '$lib/data/config';
import { createToken, shortShaId } from './crypto';
import { uuidToHex } from './uuid';

interface SwitchFacilProps {
	uuid: string;
	facilitator: App.FacilitatorRegion;
	courses: App.CourseItem[];
}
export const switchFacilitator = async (option: SwitchFacilProps) => {
	const { courses, facilitator, uuid } = option;
	const token = await createToken();
	const profileid = uuidToHex(uuid);
	const server = new URL(PUBLIC_API_SERVER + '/internal/switch');
	const res = await fetch(server.href, {
		method: 'POST',
		headers: { 'x-arcade-token': `${token}.${profileid}` },
		body: JSON.stringify({ facilitator, program: arcadeSeason.seasonid })
	});
	if (!res.ok) throw new Error('Fetch Error');

	const updatedData = courses.map((c) => {
		const validity = validateBadge(c.earndate, facilitator);
		return { ...c, validity };
	});
	initData.set(updatedData);
};

interface LoadProfileOptions {
	profileUUID: string;
	facilitator?: App.FacilitatorRegion;
	program: 'arcade' | 'juaragcp';
}

export const loadProfileAndBadges = async (option: LoadProfileOptions): Promise<App.InitData> => {
	const arcadetoken = await createToken();
	const { courses, user, token: managerToken } = await loadProfile(option, arcadetoken);
	const storedBadges = await loadBadgeList(courses, managerToken, user.uuid);
	const merged = badgeDataMerger(courses, storedBadges, option.facilitator);
	initData.set(merged);
	activeProfile.set(user);
	const containsMissingCourse = storedBadges.length < 1 && courses.length > 0;
	incompleteCalculation.set(containsMissingCourse);
	return { user, courses };
};

const loadProfile = async (option: LoadProfileOptions, token: string) => {
	const { profileUUID, program } = option || {};
	const profileid = uuidToHex(profileUUID);

	const server = new URL(PUBLIC_API_SERVER + '/internal/identity');
	if (option.program === 'arcade') {
		server.searchParams.append('program', arcadeSeason.seasonid);
		const { facilitator } = option;
		if (facilitator) server.searchParams.append('facilitator', facilitator);
	} else {
		server.searchParams.append('program', program);
	}

	const res = await fetch(server.href, {
		headers: { 'x-arcade-token': token, 'x-arcade-identity': profileid }
	});
	if (res.status !== 200) throw new Error('Fetch Error');

	const data: App.InitData = await res.json();
	const { uuid } = data.user;
	if (!uuid) throw new Error('Missing ID');
	return data;
};

interface BasePB {
	collectionId: string;
	collectionName: string;
	id: string;
	created: string;
	updated: string;
}

type PBItem = BasePB & App.CourseItem;

const loadBadgeList = async (
	courses: App.UserCourses[],
	mangerToken?: string,
	uuid?: string
): Promise<PBItem[]> => {
	const cids = courses.filter((c) => c.type === 'skill').map((c) => `courseid=${c.courseid}`);
	const bids = courses.filter((b) => b.type === 'game').map((c) => `badgeid=${c.courseid}`);
	const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
	const filteridStr = filterid ? `|| (${filterid})` : '';
	if (!mangerToken || !uuid) return [];
	if (!login(mangerToken)) return [];
	const profile = await shortShaId(`${uuid}-${arcadeSeason.seasonid}`);
	// const enrollid = await shortShaId(`${profile}`)
	// const filterProfile = `course_enrollments_via_course.profile='${profile}' &&`;

	try {
		const enrolled = pb.collection('course_enrollments').getList(1, 500, {
			filter: `profile="${profile}" && (difficulty != null || label != null)`
		});
		const courselist = pb.collection('courses').getList(1, 500, {
			filter: `((inactive=false && type != null)${filteridStr})`
		});

		const unmerged = await Promise.all([enrolled, courselist]);
		const data = unmerged[1].items.map((c) => {
			const fromuser = unmerged[0].items.find((u) => u.course === c.id);
			const userinput = {
				label: fromuser?.label || null,
				rating: fromuser?.difficulty || null
			};
			return { ...c, userinput };
		});

		// unmerged
		const result = data as unknown as PBItem[];
		return result || [];
	} catch (e) {
		console.error(e);
		return [];
	}
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
			badgeid: type === 'game' ? courseid : 0,
			courseid: type === 'game' ? 0 : courseid,
			badgeurl,
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

	if (pbBadges.length === 0) {
		for (const [key, course] of map) {
			map.set(key, {
				...course,
				earned: true,
				validity: validateBadge(course.earndate, facilitator)
			});
		}
		return Array.from(map.values());
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

	const result = Array.from(map.values());
	return result;
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
