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
		title: 'Onboarding Session Cloud AI Study Jam: #JuaraGCP',
		startdate: '15 Jan 2026, 20:00 GMT+7',
		enddate: '15 Jan 2026, 20:30 GMT+7',
		description:
			'Ikuti sesi onboarding untuk mengetahui bagaimana caranya mengikuti #JuaraGCP dan bertanya tentang program ini'
	},
	{
		title: 'Kick Off Session Cloud AI Study Jam: #JuaraGCP',
		startdate: '1 Feb 2026, 13:00 GMT+7',
		enddate: '1 Feb 2026, 16:00 GMT+7',
		description:
			'Ikuti sesi Kick-Off Session Cloud AI Study Jam: #JuaraGCP, sesi koding bersama untuk memulai perjalanan #JuaraGCP baik secara in-person dan online'
	},
	{
		title: 'Final Completion Date',
		startdate: '15 Feb 2026, 23:59 GMT+7',
		enddate: '15 Feb 2026, 23:59 GMT+7',
		description: 'Hari Terakhir mengisi Completion Form, Jangan sampai Lupa ya! :)'
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
