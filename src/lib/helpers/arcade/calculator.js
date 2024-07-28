import dayjs from 'dayjs';
import dbSkillbg from '$lib/data/skill-badges.json';
import dbGames from '$lib/data/games.json';
import dbSolutions from '$lib/data/solutions.json';
import { arcadeDate } from '../dateTime';

const filterByDate = (data = []) => {
	const filtered = data.filter(({ date }) => {
		const earnedDate = dayjs(date);
		const badgeValid = earnedDate.isAfter(arcadeDate.start) && earnedDate.isBefore(arcadeDate.end);
		return badgeValid;
	});
	return filtered;
};

const bonusDateStart = dayjs('22 July 2024, GMT+7');
const bonusDateEnd = dayjs('31 July 2024, GMT+7 ');

export const pointCounter = ({ games, skillbadges }) => {
	const points = {};
	const getPoint = (arr) => arr.map(({ point }) => point).reduce((pv = 0, cur) => pv + cur);
	Object.keys(games).forEach((key) => (points[key] = getPoint(games[key])));
	Object.keys(skillbadges).forEach((key) => (points[key] = getPoint(skillbadges[key])));
	return points;
};

export const detailPoints = (userData = []) => {
	const data = filterByDate(userData);
	const games = {};
	dbGames.map(({ courseID, courseName, type, token }) => {
		const arr = games[type] || [];
		games[type] = [...arr, { courseID, courseName, token }];
	});

	const assign = (list) => list.map((dt) => assignInfo(dt, data));
	const badges = { games: {}, skillbadges: {} };
	Object.keys(dbSkillbg).forEach((key) => (badges.skillbadges[key] = assign(dbSkillbg[key])));
	Object.keys(games).forEach((key) => (badges.games[key] = assign(games[key])));
	return badges;
};

const assignInfo = (dt, userData) => {
	const labs = dt.labs?.map((labID) => {
		const slt = dbSolutions.find(({ labID: id }) => labID?.toLowerCase() === id?.toLowerCase());
		const { sources = {} } = slt;
		const { post, github, youtube } = sources;
		return { labID, hasSolution: !!(post || github || youtube) };
	});

	const earned = userData.find(({ courseID }) => dt.courseID === courseID);
	if (!earned) return { ...dt, point: 0, labs };

	const { date } = earned;
	const earnedDate = dayjs(date);
	const hasBonus = earnedDate.isAfter(bonusDateStart) && earnedDate.isBefore(bonusDateEnd);
	dt.hasBonus = hasBonus;
	dt.point = hasBonus ? 1 : 0.5;
	dt.earnDate = date;
	const result = { ...dt, labs };
	return result;
};

export const getBonus = ({ skillbadges = 0, trivia = 0, arcade = 0 }) => {
	if (skillbadges >= 21 && trivia >= 8 && arcade >= 6) return 25;
	if (skillbadges >= 14 && trivia >= 6 && arcade >= 5) return 15;
	if (skillbadges >= 9 && trivia >= 4 && arcade >= 3) return 9;
	if (skillbadges >= 4 && trivia >= 2 && arcade >= 2) return 2;
	return 0;
};

export const getMilestone = (point) => {
	if (point >= 70) return 'Champion';
	if (point >= 60) return 'Premium Plus';
	if (point >= 40) return 'Premium';
	if (point >= 25) return 'Advanced';
	if (point >= 10) return 'Standard';
	return '-';
};
