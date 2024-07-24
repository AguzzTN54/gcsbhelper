import dbSkillbg from '$lib/data/skill-badges.json';
import dbGames from '$lib/data/games.json';
import { arcadeDate } from '../dateTime';

const dbBadges = [...dbGames];
Object.keys(dbSkillbg).forEach((key) => {
	dbSkillbg[key].forEach((data) => {
		data.group = key;
		dbBadges.push(data);
	});
});

const filterByDate = (data = []) => {
	const filtered = data.filter(({ date }) => {
		const earnedDate = new Date(date);
		const badgeValid = arcadeDate.start <= earnedDate && arcadeDate.end >= earnedDate;
		return badgeValid;
	});
	return filtered;
};

const bonusDateStart = new Date('22 July 2024, GMT+7');
const bonusDateEnd = new Date('31 July 2024, GMT+7 ');

export const pointCounter = ({ games, skillbadges }) => {
	const points = {};
	const getPoint = (arr) => arr.map(({ point }) => point).reduce((pv = 0, cur) => pv + cur);
	Object.keys(games).forEach((key) => (points[key] = getPoint(games[key])));
	Object.keys(skillbadges).forEach((key) => (points[key] = getPoint(skillbadges[key])));
	return points;
};

export const detailPoints = (userData = []) => {
	const data = userData; // filterByDate(userData);
	const games = {};
	dbGames.map(({ courseID, courseName, type, token }) => {
		const arr = games[type] || [];
		games[type] = [...arr, { courseID, courseName, token }];
	});

	const badges = { games: {}, skillbadges: {} };
	Object.keys(dbSkillbg).forEach((key) => {
		badges.skillbadges[key] = dbSkillbg[key].map((dt) => assignInfo(dt, data));
	});

	Object.keys(games).forEach((key) => {
		badges.games[key] = games[key].map((dt) => assignInfo(dt, data));
	});

	return badges;
};

const assignInfo = (dt, userData) => {
	const earned = userData.find(({ courseID }) => dt.courseID === courseID);
	if (!earned) {
		dt.point = 0;
		return dt;
	}

	const { date } = earned;
	const earnedDate = new Date(date);
	const hasBonus = bonusDateStart <= earnedDate && bonusDateEnd >= earnedDate;
	dt.hasBonus = hasBonus;
	dt.point = hasBonus ? 1 : 0.5;
	dt.earnDate = date;
	return dt;
};

export const getBonus = ({ skillbadges = 0, trivia = 0, arcade = 0 }) => {
	if (skillbadges >= 21 && trivia >= 8 && arcade >= 6) return 25;
	if (skillbadges >= 14 && trivia >= 6 && arcade >= 5) return 15;
	if (skillbadges >= 9 && trivia >= 4 && arcade >= 3) return 9;
	if (skillbadges >= 4 && trivia >= 2 && arcade >= 2) return 2;
	return 0;
};

export const getMilestone = (bonus) => {
	if (bonus >= 25) return 'Ultimate Milestone';
	if (bonus >= 15) return 'Milestone 3';
	if (bonus >= 9) return 'Milestone 2';
	if (bonus >= 2) return 'Milestone 1';
	return '-';
};
