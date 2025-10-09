import dayjs, { type Dayjs } from '$lib/helpers/dateTime';
import { juaraSeason } from '$lib/data/config';

const { end: enddate, start: startdate } = juaraSeason;
const start = dayjs(startdate);
const end = dayjs(enddate);
const today = dayjs();

interface JuaraEvent {
	ignored?: boolean;
	title: string;
	startdate: string | Dayjs | Date;
	enddate: string | Dayjs | Date;
	description: string;
}

export const events: JuaraEvent[] = [
	{
		ignored: true,
		title: 'JuaraGCP Learning Periode',
		startdate: start,
		enddate: end,
		description: 'Kumpulkan badge dan submit completion form setelah mencapai tier'
	},
	{
		title: 'Kick Start Session',
		startdate: '10 Feb 2025, 18:30 GMT+7',
		enddate: '10 Feb 2025, 19:00 GMT+7',
		description: 'Ikuti Quiz untuk memenuhi syarat perolehan swag'
	},
	{
		title: 'Quiz Half 1',
		startdate: '10 Mar 2025, 18:30 GMT+7',
		enddate: '10 Mar 2025, 19:00 GMT+7',
		description: 'Ikuti Quiz untuk memenuhi syarat perolehan swag'
	},
	{
		title: 'Quiz Half 2',
		startdate: '11 Mar 2025, 18:30 GMT+7',
		enddate: '11 Mar 2025, 19:00 GMT+7',
		description: 'Ikuti Quiz untuk memenuhi syarat perolehan swag'
	}
];

export const generateCalendarsByMonth = () => {
	const calendar: Record<string, App.JuaraCalendar[]> = {};
	let monthCursor = start.startOf('month');

	// Filter out ignored events and pre-parse the start dates to Dayjs for faster comparisons
	const validEventsStarts = events
		.filter((ev) => !ev.ignored)
		.map((ev) => dayjs(ev.startdate).startOf('day'));

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
			const hasEvent = validEventsStarts.some((evStart) => current.startOf('day').isSame(evStart));

			days.push({
				date: current,
				inCurrentMonth: current.month() === monthCursor.month(),
				today: current.isSame(today, 'day'),
				start: current.isSame(start, 'day'),
				end: current.isSame(end, 'day'),
				inPeriode: !current.isAfter(end, 'day') && !current.isBefore(start, 'day'),
				hasEvent
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
