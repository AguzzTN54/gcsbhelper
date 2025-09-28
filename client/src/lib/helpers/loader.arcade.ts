import {
	activeProfile,
	completedLabs as completedLabStore,
	incompleteCalculation,
	initData,
	loadSteps
} from '$lib/stores/app.svelte';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';
import pb from '$lib/helpers/pocketbase';
import { arcadeSeason, facilitatorPeriode } from '$lib/data/config';
import { shortShaId } from './crypto';
import { loadProfile, type LoadProfileOptions } from './loader.profile';
import { loadBadgeList, type PBItem } from './loader.badge';

export const loadProfileAndBadges = async (option: LoadProfileOptions): Promise<App.InitData> => {
	Object.keys(loadSteps).forEach((k) => (loadSteps[k as keyof typeof loadSteps] = false));
	const { courses, user, token } = await loadProfile(option);
	loadSteps.profile = true;
	activeProfile.set(user);

	const storedBadges = await loadBadgeList({ courses, token, uuid: user.uuid });
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
	const labsCompleted = new Set<string>();
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

	completedLabStore.set(labsCompleted);
	return updated;
};
