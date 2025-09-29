import { regularbadges, skillbadges } from '$lib/data/juaragcp';
import { activeProfile, loadSteps } from '$lib/stores/app.svelte';
import { juaraSeason } from '$lib/data/config';
import dayjs from '$lib/helpers/dateTime';
import { loadBadgeList } from './loader.badge';
import { loadProfile, type LoadProfileOptions } from './loader.profile';

const { end, seasonid, start } = juaraSeason;
export const loadJuaraProfile = async (option: LoadProfileOptions): Promise<App.InitData> => {
	Object.keys(loadSteps).forEach((k) => (loadSteps[k as keyof typeof loadSteps] = false));
	const { courses, user, token } = await loadProfile(option);
	loadSteps.profile = true;
	activeProfile.set(user);
	const data = mergeUserBadgesToDbBadges(courses);
	loadSteps.courselist = true;

	// loadBadgeData(user.uuid, token);

	// const containsMissingCourse = storedBadges.length < 1 && courses.length > 0;
	// incompleteCalculation.set(containsMissingCourse);
	// if (courses.length > 0) loadEnrollment(user.uuid);
	// if (basicData.length > 0) loadCourseStats(basicData);
	return { user, courses: data };
};

const mergeUserBadgesToDbBadges = (usercourses: App.UserCourses[]): App.JuaraBadge[] => {
	const dbBadges = [...regularbadges, ...skillbadges];
	const merged = dbBadges.map(({ courseid, title, type, required }) => {
		const samerecord = usercourses.find((uc) => uc.courseid === courseid);
		const { title: userTitle, badgeurl, date } = samerecord || {};
		const badgeDate = date ? dayjs(date) : null;
		const validity = (badgeDate && !badgeDate.isAfter(end) && !badgeDate.isBefore(start)) || false;

		const result: App.JuaraBadge = {
			title: userTitle ?? title,
			courseid,
			type,
			required,
			badgeurl,
			date,
			validity
		};
		return result;
	});

	return merged;
};

const loadBadgeData = async (uuid: string, token?: string) => {
	if (!token || !uuid) return;
	const storedBadges = await loadBadgeList({
		courses: [...regularbadges, ...skillbadges],
		token,
		uuid: uuid,
		loadGivenCourseOnly: true
	});

	console.log('storedBadges', storedBadges);
};
