import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export default dayjs;
export type Dayjs = dayjs.Dayjs;

const timeOffset = new Date().getTimezoneOffset() / -60;
export const timeZone = `GMT${timeOffset > 0 ? '+' : ''}${timeOffset}`;

export const delay = async (ms: number = 0) => {
	if (ms <= 0) return;
	return new Promise((resolve) => {
		const t = setTimeout(() => {
			clearTimeout(t);
			resolve(true);
		}, ms);
	});
};
