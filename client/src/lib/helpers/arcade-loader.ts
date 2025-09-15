import { PUBLIC_API_SERVER } from '$env/static/public';
import { activeProfile, incompleteCalculation, initData, loadSteps } from '$lib/stores/app.svelte';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';
import pb, { login } from '$lib/helpers/pocketbase';
import { arcadeSeason, facilitatorPeriode } from '$lib/data/config';
import { createToken, shortShaId } from './crypto';
import { uuidToHex } from './uuid';

interface LoadProfileOptions {
	profileUUID: string;
	facilitator?: App.FacilitatorRegion;
	program: 'arcade' | 'juaragcp';
}

export const loadProfileAndBadges = async (option: LoadProfileOptions): Promise<App.InitData> => {
	Object.keys(loadSteps).forEach((k) => (loadSteps[k as keyof typeof loadSteps] = false));
	const arcadetoken = await createToken();
	const { courses, user, token: managerToken } = await loadProfile(option, arcadetoken);
	loadSteps.profile = true;
	activeProfile.set(user);

	const storedBadges = await loadBadgeList(courses, managerToken, user.uuid);
	const merged = badgeDataMerger(courses, storedBadges, option.facilitator);
	const basicData = loadProgress(merged);
	initData.set(basicData);
	loadSteps.courselist = true;
	const containsMissingCourse = storedBadges.length < 1 && courses.length > 0;
	incompleteCalculation.set(containsMissingCourse);
	if (courses.length > 0) loadEnrollment(user.uuid);
	if (basicData.length > 0) loadCourseStats(basicData);
	return { user, courses };
};

const loadProfile = async (option: LoadProfileOptions, token: string) => {
	const { profileUUID, program } = option || {};
	const profileid = uuidToHex(profileUUID);

	const server = new URL(PUBLIC_API_SERVER + '/internal/identity/' + profileid);
	if (option.program === 'arcade') {
		server.searchParams.append('program', arcadeSeason.seasonid);
		const { facilitator } = option;
		if (facilitator) server.searchParams.append('facilitator', facilitator);
	} else {
		server.searchParams.append('program', program);
	}

	const res = await fetch(server.href, { headers: { 'x-arcade-token': token } });
	if (res.status !== 200) throw new Error('Fetch Error');

	const data: App.InitData = await res.json();
	const { uuid } = data.user;
	if (!uuid) throw new Error('Missing ID');
	return data;
};

interface BasePB {
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
}

type PBItem = BasePB & App.CourseItem;

const loadBadgeList = async (
	courses: App.UserCourses[],
	managerToken?: string,
	uuid?: string
): Promise<PBItem[]> => {
	if (!managerToken || !uuid) return [];
	if (!login(managerToken)) return [];

	// Split array into chunks of maxSize
	const chunkArray = <T>(arr: T[], maxSize: number): T[][] =>
		arr.reduce((acc: T[][], _, i) => {
			if (i % maxSize === 0) acc.push(arr.slice(i, i + maxSize));
			return acc;
		}, []);

	// Build filters per chunk
	const buildFilter = (chunk: 'default' | App.UserCourses[]) => {
		if (chunk === 'default') return '(inactive=false&&type!=null)';
		const cids = chunk.filter((c) => c.type === 'skill').map((c) => `courseid=${c.courseid}`);
		const bids = chunk.filter((b) => b.type === 'game').map((c) => `badgeid=${c.courseid}`);
		const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
		return filterid;
	};

	// Split into 100-sized chunks
	const chunks: ('default' | App.UserCourses[])[] = [...chunkArray(courses, 100), 'default'];
	try {
		const results = await Promise.all(
			chunks.map(async (chunk, i) => {
				const filter = buildFilter(chunk);
				const courselist = await pb.collection('courses').getList(1, 500, {
					filter,
					requestKey: 'key' + i,
					skipTotal: true,
					expand: 'labs'
				});
				return courselist.items as unknown as PBItem[];
			})
		);

		// Flatten all results
		return results.flat();
	} catch (e) {
		console.error('Error loading courses:', e);
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

	for (const { collectionId, collectionName, created, updated, ...obj } of pbBadges) {
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
export const validateBadge = (
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

const loadEnrollment = async (uuid: string) => {
	const profile = await shortShaId(`${uuid}-${arcadeSeason.seasonid}`);
	const enrolled = await pb.collection('course_enrollments').getList(1, 500, {
		filter: `profile="${profile}" && (difficulty != null || label != null)`,
		fields: 'course,difficulty,label',
		skipTotal: true
	});

	initData.update((courses) => {
		const updated = courses.map((c) => {
			const fromuser = enrolled?.items?.find((u) => u.course === c.id);
			const userinput = {
				label: fromuser?.label || null,
				rating: fromuser?.difficulty || null
			};
			return { ...c, userinput };
		});
		return updated;
	});
	loadSteps.enrollmentdata = true;
};

interface PBStats extends App.CourseStats {
	collectionId: string;
	collectionName: string;
	id: string;
	title: string;
}

const loadCourseStats = async (mergedcourses: App.CourseItem[]) => {
	const ids = mergedcourses.map((c) => c?.id).filter((v): v is string => !!v);

	if (!ids.length) return [];

	// split ids into chunks of 100
	const chunkSize = 100;
	const chunks: string[][] = [];
	for (let i = 0; i < ids.length; i += chunkSize) {
		chunks.push(ids.slice(i, i + chunkSize));
	}

	try {
		const results = await Promise.all(
			chunks.map((chunk, i) => {
				const filter = chunk.map((id) => pb.filter('id={:id}', { id })).join('||');
				return pb.collection('course_stats').getList(1, 300, {
					fields: 'diff_easy,diff_hard,diff_medium,enrollment_count,id',
					skipTotal: true,
					requestKey: 'key' + i,
					filter
				});
			})
		);

		// flatten items from all batches
		const stats = results.flatMap((res) => res.items);

		initData.update((courses) => {
			const updated = courses.map((c) => {
				const stat = stats.find((v) => v.id === c.id) as unknown as PBStats;
				const { diff_easy, diff_hard, diff_medium, enrollment_count } = stat || {};
				return { ...c, stats: { diff_easy, diff_hard, diff_medium, enrollment_count } };
			});
			return updated;
		});
		loadSteps.stats = true;
	} catch (e) {
		console.error('Failed to get Stats' + e);
	}
};

const loadProgress = (courses: App.CourseItem[]) => {
	const labsCompleted = new Set();
	courses
		.filter((c) => c.earned)
		.forEach((course) => {
			course.labs?.forEach((lab) => labsCompleted.add(lab));
		});

	const updated = courses.map((c) => {
		const completedLabs = c.labs?.filter((lab) => labsCompleted.has(lab));
		const progress = completedLabs?.length;
		return { ...c, progress };
	});

	return updated;
};
