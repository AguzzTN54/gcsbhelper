import dayjs from '$lib/helpers/dateTime';
import { juaraSeason } from '$lib/data/config';

const { end: enddate, start: startdate } = juaraSeason;
const start = dayjs(startdate);
const end = dayjs(enddate);
const today = dayjs();

export const generateCalendarsByMonth = () => {
	const calendar: Record<string, App.JuaraCalendar[]> = {};
	let monthCursor = start.startOf('month');

	while (monthCursor.isBefore(end, 'month') || monthCursor.isSame(end, 'month')) {
		const monthKey = monthCursor.format('YYYY-MM');
		const startOfMonth = monthCursor.startOf('month');
		const endOfMonth = monthCursor.endOf('month');

		// Calendar grid boundaries (Sunday–Saturday)
		const startOfCalendar = startOfMonth.startOf('week');
		const endOfCalendar = endOfMonth.endOf('week');

		const days: App.JuaraCalendar[] = [];
		let current = startOfCalendar;

		while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
			days.push({
				date: current,
				inCurrentMonth: current.month() === monthCursor.month(),
				today: current.isSame(today, 'day'),
				start: current.isSame(start, 'day'),
				end: current.isSame(end, 'day'),
				eventRange: !current.isAfter(end, 'day') && !current.isBefore(start, 'day')
			});
			current = current.add(1, 'day');
		}

		calendar[monthKey] = days;
		monthCursor = monthCursor.add(1, 'month');
	}

	const currentMonth = Object.keys(calendar).findIndex((m) => dayjs().format('YYYY-MM') === m);
	return {
		currentMonth: currentMonth < 0 ? 0 : currentMonth,
		calendar
	};
};
