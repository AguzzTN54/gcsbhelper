import db from '$lib/data/juaragcp.json';
import dayjs, { juaraDate } from './dateTime';

export const lookupBadges = (userData: App.UserCourses[]) => {
	const sourcedata = db as App.DataScheme[];
	return sourcedata.map(({ list, group, title }) => {
		const checkCourses = ({ courses, group, title }: App.CourseList) => {
			const updatedCourses = courses.map((d) => checkItem(d, userData));
			return { courses: updatedCourses, group, title };
		};
		const result = { list: list.map(checkCourses), group, title };
		return result;
	});
};

const checkItem = (dt: App.SourceCourses, userData: App.UserCourses[]) => {
	const { courseid, title, required } = dt;
	const earned = userData.find(({ courseid: id }) => courseid === id);
	const { date } = earned || {};
	if (!earned) return { courseid, title, date, required };

	// if badge Earned
	const d = dayjs(date);
	dt.date = d;

	const { end, start } = juaraDate;
	const startDate = d.isSame(start, 'date') || d.isAfter(start);
	const endDate = d.isBefore(end) || d.isSame(end, 'date');
	const validity = startDate && endDate;
	return { ...dt, validity };
};

export const badgeCounter = (badges: App.DataScheme[]) => {
	const badgeCount = { skill: 0, completion: 0, incomplete: 0 };
	const counter = ({ group, courses }: App.CourseList) => {
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

export const checkTier = (badges: App.DataScheme[]) => {
	if (badges.length < 1) return { status: 'incomplete', tier: 0 };

	const { completion, skill, incomplete } = badgeCounter(badges);
	const status = incomplete > 0 ? 'incomplete' : 'complete'; // is Required Lab completed?
	const total = completion + skill;
	const result = { status, badgeCount: total };

	if (skill >= 8 && total >= 15) return { tier: 2, ...result };
	if (skill >= 5 && total >= 8) return { tier: 1, ...result };
	return { status: 'incomplete', tier: 0, badgeCount: 0 };
};
