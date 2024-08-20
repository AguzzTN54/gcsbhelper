import db from '$lib/data/juaragcp.json';
import dayjs, { juaraDate } from './dateTime';

export const lookupBadges = (data = []) => {
	return db.map(({ list, group, title }) => {
		const checkCourses = ({ courses, group, title }) => {
			const updatedCourses = courses.map((d) => checkItem(d, data));
			return { courses: updatedCourses, group, title };
		};
		const result = { list: list.map(checkCourses), group, title };
		return result;
	});
};

const checkItem = (dt, userData) => {
	const { courseID, courseName } = dt;
	const earned = userData.find(({ courseID: id }) => courseID === id);
	const { date: earnDate } = earned || {};
	if (!earned) return { courseID, courseName, earnDate };

	// if badge Earned
	const { date } = earned;
	const d = dayjs(date);
	dt.earnDate = date;

	const { end, start } = juaraDate;
	const startDate = d.isSame(start, 'date') || d.isAfter(start);
	const endDate = d.isBefore(end) || d.isSame(end, 'date');
	const validity = startDate && endDate;
	return { ...dt, validity };
};

const badgeCounter = (badges) => {
	const badgeCount = { skill: 0, completion: 0 };
	const counter = ({ group, courses }) => {
		courses.forEach(({ validity }) => {
			if (!validity) return;
			if (/-sb/.test(group)) badgeCount['skill'] += 1;
			badgeCount['completion'] += 1;
		});
	};
	badges.forEach(({ list }) => list.forEach(counter));
	return badgeCount;
};
export const checkTier = (badges) => {
	const { completion, skill } = badgeCounter(badges);
	const total = completion + skill;
	if (skill >= 7 && total >= 16) return 2;
	if (skill >= 4 && total >= 10) return 1;
	return 0;
};
