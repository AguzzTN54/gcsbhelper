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
	const { courseID, courseName, required } = dt;
	const earned = userData.find(({ courseID: id }) => courseID === id);
	const { date: earnDate } = earned || {};
	if (!earned) return { courseID, courseName, earnDate, required };

	// if badge Earned
	const d = dayjs(earnDate);
	dt.earnDate = d;

	const { end, start } = juaraDate;
	const startDate = d.isSame(start, 'date') || d.isAfter(start);
	const endDate = d.isBefore(end) || d.isSame(end, 'date');
	const validity = startDate && endDate;
	return { ...dt, validity };
};

export const badgeCounter = (badges) => {
	const badgeCount = { skill: 0, completion: 0, incomplete: 0 };
	const counter = ({ group, courses }) => {
		courses.forEach(({ validity, required }) => {
			if (!validity) {
				if (!required) return;
				return (badgeCount['incomplete'] += 1);
			}

			// Valid Badges
			if (/-sb/.test(group)) return (badgeCount['skill'] += 1);
			badgeCount['completion'] += 1;
		});
	};
	badges.forEach(({ list }) => list.forEach(counter));
	return badgeCount;
};

export const checkTier = (badges) => {
	const { completion, skill, incomplete } = badgeCounter(badges);
	const status = incomplete ? 'incomplete' : 'complete';

	const total = completion + skill;
	if (skill >= 7 && total >= 16) return { status, tier: 2 };
	if (skill >= 5 && total >= 10) return { status, tier: 1 };
	return { status, tier: 0 };
};
