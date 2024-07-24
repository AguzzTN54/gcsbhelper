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

export const pointCounter = (data = []) => {
	// const inPeriode = filterByDate(data);
	const pointList = data.map(({ courseID, date }) => {
		const db = dbBadges.find(({ courseID: id }) => id === courseID);
		if (!db) return 0;
		const earnedDate = new Date(date);
		const hasBonus = bonusDateStart <= earnedDate && bonusDateEnd >= earnedDate;
		const { type } = db;
		if (type === 'skill' && hasBonus) return 1;
		if (/(game|arcade|trivia)/.test(type)) return 1;
		return 0.5;
	});
	const total = pointList.reduce((pv = 0, cur) => (pv || 0) + cur);
	return total;
};

export const detailPoints = (data = []) => {
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
