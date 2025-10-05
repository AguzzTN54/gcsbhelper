import { regularbadges, skillbadges } from '$lib/data/juaragcp';
import { activeProfile, juaraBadges, loadSteps } from '$lib/stores/app.svelte';
import { juaraSeason } from '$lib/data/config';
import dayjs from '$lib/helpers/dateTime';
import { loadBadgeList, loadBadgeStats } from './loader.badge';
import { loadProfile, type LoadProfileOptions } from './loader.profile';

const { end, start } = juaraSeason;
export const loadJuaraProfile = async (option: LoadProfileOptions): Promise<App.InitData> => {
	Object.keys(loadSteps).forEach((k) => (loadSteps[k as keyof typeof loadSteps] = false));

	const loadPbBadges = loadBadgeList({
		courses: [...regularbadges, ...skillbadges],
		loadGivenCourseOnly: true
	});
	const [{ user, courses }, pbBadges] = await Promise.all([loadProfile(option), loadPbBadges]);

	loadSteps.profile = true;
	activeProfile.set(user);
	const data = mergeUserBadgesToDbBadges(courses, pbBadges);
	loadSteps.courselist = true;
	loadStatsData(data);
	return { user, courses: data };
};

const mergeUserBadgesToDbBadges = (
	usercourses: App.UserCourses[],
	pbBadges: App.CourseItem[]
): App.JuaraBadge[] => {
	const dbBadges = [...regularbadges, ...skillbadges];
	const merged = dbBadges.map(({ courseid, title, type, required }) => {
		const samerecord = usercourses.find((uc) => uc.courseid === courseid);
		const pbRecord = pbBadges.find((pb) => pb.courseid === courseid);
		const { title: userTitle, badgeurl, date } = samerecord || {};
		const badgeDate = date ? dayjs(date) : null;
		const validity = (badgeDate && !badgeDate.isAfter(end) && !badgeDate.isBefore(start)) || false;

		const result: App.JuaraBadge = {
			id: pbRecord?.id,
			title: userTitle ?? title,
			courseid,
			type,
			required,
			date,
			validity,
			badgeurl: badgeurl || pbRecord?.badgeurl,
			totallab: pbRecord?.totallab
		};
		return result;
	});

	return merged;
};

interface PBStats extends App.CourseStats {
	collectionId: string;
	collectionName: string;
	id: string;
	title: string;
}

const loadStatsData = async (data: App.JuaraBadge[]) => {
	const ids = data.map((c) => c?.id).filter((v): v is string => !!v);
	if (ids.length < 1) return [];

	try {
		const stats = await loadBadgeStats(ids);
		juaraBadges.update((courses) => {
			const updated = courses.map((c) => {
				const stat = stats.find((v) => v.id === c.id) as unknown as PBStats;
				const { enrollment_count } = stat || {};
				return { ...c, enrollment_count };
			});
			return updated;
		});
		loadSteps.stats = true;
	} catch (e) {
		console.error('Failed to get Stats' + e);
	}
};
