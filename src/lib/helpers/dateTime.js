import dayjs from 'dayjs';

export const arcadeDate = {
	start: dayjs('15 July 2024, 18:30 GMT+7'),
	end: dayjs('28 September 2024, 01:29 GMT+7')
};

export const arcadeBonus = {
	value: 1,
	bonusDateStart: dayjs('22 July 2024, EDT'),
	bonusDateEnd: dayjs('31 July 2024, EDT'),
	cdlEnd: dayjs('5 August 2024, EDT')
};

const timeOffset = new Date().getTimezoneOffset() / -60;
export const timeZone = `GMT${timeOffset > 0 ? '+' : ''}${timeOffset}`;
