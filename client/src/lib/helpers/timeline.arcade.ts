import { facilitatorPeriode } from '$lib/data/config';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';

interface EventItem {
	startdate: string;
	enddate: string;
	title: string;
	image: string;
	type?: 'trivia' | 'game' | 'wmp' | 'special' | 'cert' | 'expected';
}
const manualEvents: Record<App.FacilitatorRegion, EventItem[]> = {
	india: [
		{
			startdate: facilitatorPeriode.india.start,
			enddate: facilitatorPeriode.india.end,
			title: 'Arcade Facilitator',
			image: ''
		}
	],
	indonesia: [
		{
			startdate: '15 Jul 2025',
			enddate: '09 Sep 2025',
			title: 'Facilitator Registration',
			image: ''
		},
		{
			startdate: facilitatorPeriode.indonesia.start,
			enddate: facilitatorPeriode.indonesia.end,
			title: 'Arcade Facilitator',
			image: ''
		}
	],
	unset: []
};

const titles = {
	trivia: 'Trivia',
	wmp: 'Work Meet Play',
	game: 'Games',
	special: 'Special',
	cert: 'Certification Zone'
};
const getDateRange = (
	data: App.CourseItem[],
	timelineType: 'trivia' | 'wmp' | 'game' | 'special' | 'cert'
) => {
	const filtered = data.filter(({ type, startdate, point, title }) => {
		if (!startdate) return false;

		const isCert = title?.toLowerCase().includes('certification');
		switch (timelineType) {
			case 'trivia':
			case 'wmp':
				return type?.toLowerCase() === timelineType;
			case 'special':
				return type?.toLowerCase() === 'game' && point === 2 && !isCert;
			case 'game':
				return type?.toLowerCase() === 'game' && point !== 2 && !isCert;
			case 'cert':
				return isCert;
			default:
				return false;
		}
	});

	const grouped = filtered.reduce(
		(acc, item) => {
			const monthKey = dayjs(item.startdate).format('YYYY-MM');
			if (!acc[monthKey]) acc[monthKey] = [];
			acc[monthKey].push(item);
			return acc;
		},
		{} as Record<string, App.CourseItem[]>
	);

	const result = Object.entries(grouped).map(([month, items]): EventItem => {
		const ranges = items.map((i) => [i.startdate, i.enddate]);

		const earliestStart = ranges.reduce(
			(min, [s]) => (dayjs(s).isBefore(min) ? dayjs(s) : min),
			dayjs(ranges[0][0])
		);

		const farthestEnd = ranges.reduce(
			(max, [, e]) => (dayjs(e).isAfter(max) ? dayjs(e) : max),
			dayjs(ranges[0][1])
		);

		const monthName = dayjs(month + '-01').format('MMMM');
		const type = timelineType;
		const title = type.match(/wmp|cert|special/)
			? items[0].title?.replace(/Work Meets Play/, 'WMP').replace(/Skills(.+)Zone/, 'Cert Zone')
			: `${titles[type]} ${monthName}`;

		return {
			startdate: earliestStart.toISOString(),
			enddate: farthestEnd.toISOString(),
			image: items.find((i) => i.badgeurl)?.badgeurl || '',
			title,
			type
		};
	});

	return result;
};

const groupTimeline = (data: EventItem[]): EventItem[][] => {
	const sorted = [...data]
		.filter((d) => !dayjs(d.enddate).isBefore(new Date()))
		.sort((a, b) => dayjs(a.startdate).valueOf() - dayjs(b.startdate).valueOf());

	const result: EventItem[][] = [];
	for (const d of sorted) {
		const start = dayjs(d.startdate);
		let placed = false;

		for (const group of result) {
			const last = group[group.length - 1];
			const lastEnd = dayjs(last.enddate);

			if (!start.isBefore(lastEnd)) {
				group.push(d);
				placed = true;
				break;
			}
		}
		if (!placed) result.push([d]);
	}
	return result;
};

const getTimelineRange = (content: EventItem[]) => {
	const startOfMonth = dayjs().startOf('month');

	const minStart = content.reduce(
		(min, item) => (dayjs(item.startdate).isBefore(min) ? dayjs(item.startdate) : min),
		dayjs(content[0]?.startdate)
	);
	const limitedMinStart = minStart.isBefore(startOfMonth) ? startOfMonth : minStart;

	const maxEnd = content.reduce(
		(max, item) => (dayjs(item.enddate).isAfter(max) ? dayjs(item.enddate) : max),
		dayjs(content[0]?.enddate)
	);

	return {
		startrange: limitedMinStart,
		endrange: maxEnd
	};
};

const nexMonthGame = (games: EventItem[]): EventItem[] => {
	const today = dayjs();
	const firstDayNextMonth = dayjs().add(1, 'month').startOf('month');
	const daysToNextMonth = firstDayNextMonth.diff(today, 'day');
	if (daysToNextMonth || (today.date() >= 6 && games.length > 0)) {
		return [];
	}

	let firstMondayNextMonth = firstDayNextMonth.day(1);
	if (firstMondayNextMonth.month() !== firstDayNextMonth.month()) {
		firstMondayNextMonth = firstMondayNextMonth.add(1, 'week');
	}

	const startdate = firstMondayNextMonth.hour(11).minute(0).second(0).millisecond(0);
	const enddate = startdate.add(5, 'day');

	return [
		{
			startdate: startdate.toISOString(),
			enddate: enddate.toISOString(),
			title: 'Expected New Games',
			type: 'expected',
			image: ''
		}
	];
};

export const getTimelineContents = (
	data: App.CourseItem[],
	facilId: string
): { startrange: Dayjs; endrange: Dayjs; timeline: EventItem[][] } => {
	const trv = getDateRange(data, 'trivia');
	const games = getDateRange(data, 'game');
	const wmp = getDateRange(data, 'wmp');
	const special = getDateRange(data, 'special');
	const cert = getDateRange(data, 'cert');
	const region = (facilId?.split('_')?.[1] || 'unset') as keyof typeof manualEvents;
	const specificFacil = manualEvents[region];
	const expectedNexMonth = nexMonthGame(games);
	const content: EventItem[] = [
		...specificFacil,
		...special,
		...cert,
		...wmp,
		...games,
		...trv,
		...expectedNexMonth
	];
	const groupedEvents = groupTimeline(content);
	return {
		...getTimelineRange(content),
		timeline: groupedEvents
	};
};
