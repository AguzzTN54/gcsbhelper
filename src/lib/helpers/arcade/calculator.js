import dayjs from 'dayjs';
import dbPaths from '$lib/data/learning-path.json';
import dbSkillbg from '$lib/data/skill-badges.json';
import dbGames from '$lib/data/games.json';
import dbSolutions from '$lib/data/solutions.json';
import { arcadeBonus, arcadeDate } from '../dateTime';

const filterByDate = (data = []) => {
	return data.filter(({ date }) => {
		const earnedDate = dayjs(date);
		const { start, end } = arcadeDate;
		const badgeValid = earnedDate.isAfter(start) && earnedDate.isBefore(end);
		return badgeValid;
	});
};

const { value: bonusVal, bonusDateEnd, bonusDateStart } = arcadeBonus;
export const pointCounter = ({ games, skillbadges, paths }) => {
	const points = {};
	const getPoint = (arr) => arr.map(({ point }) => point).reduce((pv = 0, cur) => pv + cur);
	games.forEach(({ group, courses }) => (points[group] = getPoint(courses)));
	skillbadges.forEach(({ group, courses }) => (points[group] = getPoint(courses)));
	paths.forEach(({ point, isComplete }) => (points['additional'] = isComplete ? point : 0));
	return points;
};

export const detailPoints = (userData = []) => {
	const data = filterByDate(userData);
	const paths = parseData(data, dbPaths, 'paths');
	const skillbadges = parseData(data, dbSkillbg, 'skillbadges');
	const games = parseData(data, dbGames, 'games');

	const badges = { games, skillbadges, paths };
	const assign = (list, point) => list.map((dt) => assignInfo(dt, data, point));
	skillbadges.forEach(({ courses, point }, i) => (skillbadges[i].courses = assign(courses, point)));
	games.forEach(({ courses, point }, i) => (games[i].courses = assign(courses, point)));
	paths.forEach(({ courses, point }, i) => (paths[i].courses = assign(courses, point)));
	return badges;
};

const parseData = (userData = [], db, type) => {
	const info = ({ courseID, courseName, token, labs }) => {
		const earned = userData.find(({ courseID: id }) => courseID === id);
		const { date: earnDate = null } = earned || {};
		return { courseID, courseName, type, earnDate, token, labs };
	};

	return db.map(({ pathID, title, courses, point, group }) => {
		const completions = [];
		const assigned = courses.map(info);
		assigned.forEach(({ earnDate }) => completions.push(!!earnDate));
		const isComplete = !completions.includes(false);
		return { pathID, group, title, isComplete, point, courses: assigned, type };
	});
};

const assignInfo = (dt, userData, point = 0) => {
	const labs = dt.labs?.map((labID) => {
		const slt = dbSolutions.find(({ labID: id }) => labID?.toLowerCase() === id?.toLowerCase());
		const { sources = {} } = slt || {};
		const { post, github, youtube } = sources;
		return { labID, hasSolution: !!(post || github || youtube) };
	});

	const earned = userData.find(({ courseID }) => dt.courseID === courseID);
	if (!earned) return { ...dt, point: 0, labs };

	// if badge Earned
	const { date } = earned;
	const d = dayjs(date);
	const end = d.isBefore(bonusDateEnd) || d.isSame(bonusDateEnd, 'date');
	const hasBonus = d.isAfter(bonusDateStart) && end;
	dt.hasBonus = hasBonus;
	dt.point = hasBonus ? bonusVal : point;
	dt.earnDate = date;
	const result = { ...dt, labs };
	return result;
};

export const getBonus = ({ skillbadges = 0, trivia = 0, arcade = 0 }) => {
	if (skillbadges >= 42 && trivia >= 8 && arcade >= 6) return 25;
	if (skillbadges >= 28 && trivia >= 6 && arcade >= 5) return 15;
	if (skillbadges >= 18 && trivia >= 4 && arcade >= 3) return 9;
	if (skillbadges >= 8 && trivia >= 2 && arcade >= 2) return 2;
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
