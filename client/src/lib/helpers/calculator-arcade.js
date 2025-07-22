import dbPaths from '$lib/data/learning-path.json';
import dbSkillbg from '$lib/data/skill-badges.json';
import dbGames from '$lib/data/games.json';
import dbSolutions from '$lib/data/solutions.json';
import dayjs, { arcadeBonus, arcadeDate } from './dateTime';

const { value: bonusVal, bonusDateEnd, bonusDateStart, cdlEnd } = arcadeBonus;
export const pointCounter = ({ games, skillbadges, bonus }) => {
	let skillbadgesCount = 0;
	const points = { additional: 0, arcade: 0, trivia: 0, skillbadges: 0 };
	const getPoint = (arr) => arr.map(({ point }) => point).reduce((pv = 0, cur) => pv + cur);
	skillbadges.forEach(({ courses }) => {
		skillbadgesCount += courses.filter(({ point }) => point).length;
		points['skillbadges'] += getPoint(courses);
	});
	games.forEach(({ group, courses }) => {
		if (/(trivia)/.test(group)) return (points['trivia'] += getPoint(courses));
		if (/(arcade)/.test(group)) return (points['arcade'] += getPoint(courses));
	});
	bonus.forEach(({ point, isComplete, pathID, courses }) => {
		if (!pathID) return (points['additional'] += getPoint(courses));
		points['additional'] += isComplete ? point : 0;
	});
	points['bonus'] = getBonus({ ...points, skillbadges: skillbadgesCount });
	return points;
};

export const detailPoints = (data = []) => {
	const bonus = [...parseData(data, dbPaths, 'paths'), ...parseData(data, dbGames, 'bonusGame')];
	const skillbadges = parseData(data, dbSkillbg, 'skillbadges');
	const games = parseData(data, dbGames, 'games');
	return { games, skillbadges, bonus };
};

const parseData = (userData = [], db, type) => {
	const assign = (list, point) => list.map((dt) => assignInfo(dt, userData, point));
	const info = ({ courseID, courseName, token, labs, point: base_point }) => {
		const earned = userData.find(({ courseID: id }) => courseID === id);
		const { date: earnDate = null } = earned || {};
		return { courseID, courseName, type, earnDate, token, labs, base_point };
	};

	const filtered = db.filter(({ group }) => {
		if (type === 'bonusGame') return /more/.test(group);
		if (type === 'games') return !/more/.test(group);
		return true;
	});

	return filtered.map(({ pathID, title, courses, point, group, type }) => {
		const completions = [];
		const assigned = courses.map(info);
		const newCourses = assign(assigned, point);
		newCourses.forEach(({ validity, earnDate }) => completions.push(!!(validity && earnDate)));
		const isComplete = !completions.includes(false);
		return { pathID, group, title, isComplete, point, type, courses: newCourses };
	});
};

const assignInfo = (dt, userData, point = 0) => {
	const labs = dt.labs?.map((labID) => {
		const slt = dbSolutions.find(({ labID: id }) => labID?.toLowerCase() === id?.toLowerCase());
		const { sources = {} } = slt || {};
		const { post, github, youtube } = sources;
		return { labID, hasSolution: !!(post || github || youtube) };
	});

	const { courseID, courseName } = dt;
	const checkEarned = ({ courseID: id, courseName: n }) => courseID === id || courseName === n;
	const earned = userData.find(checkEarned);
	if (!earned) return { ...dt, labs, point: 0 };

	// if badge Earned
	const { date } = earned;
	const d = dayjs(date);
	dt.earnDate = d;

	if (dt.type === 'paths') {
		const validity = d.isBefore(cdlEnd) || d.isSame(cdlEnd, 'date');
		return { ...dt, labs, validity };
	}

	const { end, start } = arcadeDate;
	const endDate = d.isBefore(end) || d.isSame(end, 'date');
	const validity = d.isAfter(start) && endDate;
	const bonusEnd = d.isBefore(bonusDateEnd) || d.isSame(bonusDateEnd, 'date');
	const hasBonus = d.isAfter(bonusDateStart) && bonusEnd;
	dt.hasBonus = hasBonus;
	dt.point = !validity ? 0 : hasBonus ? bonusVal : dt.base_point || point;
	return { ...dt, labs, validity };
};

export const getBonus = ({ skillbadges = 0, trivia = 0, arcade = 0 }) => {
	// Ultimate
	if (skillbadges >= 42 && trivia >= 8 && arcade >= 6) return 25;
	if (skillbadges >= 44 && trivia >= 4 && arcade >= 4) return 30;

	// Mile 3
	if (skillbadges >= 28 && trivia >= 6 && arcade >= 5) return 15;
	if (skillbadges >= 30 && trivia >= 3 && arcade >= 3) return 19;

	// Mile 2
	if (skillbadges >= 18 && trivia >= 4 && arcade >= 3) return 9;
	if (skillbadges >= 20 && trivia >= 2 && arcade >= 2) return 11;

	// Mile1
	if (skillbadges >= 8 && trivia >= 2 && arcade >= 2) return 2;
	if (skillbadges >= 10 && trivia >= 1 && arcade >= 1) return 3;
	return 0;
};

export const getBonusMilestone = (point) => {
	if (point >= 25) return 'Ultimate Milestone';
	if (point >= 15) return 'Milestone #3';
	if (point >= 9) return 'Milestone #2';
	if (point >= 8) return 'Milestone #1';
	return 'No Milestone Bonus';
};

export const getMilestone = (point) => {
	if (point >= 70) return 'Champion';
	if (point >= 60) return 'Premium Plus';
	if (point >= 40) return 'Premium';
	if (point >= 25) return 'Advanced';
	if (point >= 10) return 'Standard';
	return '-';
};
