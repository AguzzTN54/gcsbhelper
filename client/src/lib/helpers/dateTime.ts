import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export default dayjs;
export type Dayjs = dayjs.Dayjs;

const timeOffset = new Date().getTimezoneOffset() / -60;
export const timeZone = `GMT${timeOffset > 0 ? '+' : ''}${timeOffset}`;
