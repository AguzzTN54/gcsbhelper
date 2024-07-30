import dayjs from 'dayjs';

export const arcadeDate = {
	start: dayjs('15 July 2024, 18:30 GMT+7'),
	end: dayjs('23 September 2024, 01:29 GMT+7')
};

export const arcadeBonus = {
	value: 1,
	bonusDateStart: dayjs('22 July 2024, GMT+7'),
	bonusDateEnd: dayjs('31 July 2024, GMT+7 ')
};

const timeOffset = new Date().getTimezoneOffset() / -60;
export const timeZone = `GMT${timeOffset > 0 ? '+' : ''}${timeOffset}`;
