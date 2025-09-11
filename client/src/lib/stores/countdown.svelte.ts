import { writable } from 'svelte/store';
import dayjs, { type Dayjs } from '$lib/helpers/dateTime';

export const createCountdown = (endDate?: string | Date | Dayjs) => {
	const { subscribe, set } = writable({ d: 0, h: 0, m: 0, s: 0 });
	if (!endDate) return { subscribe, stop: () => {} };

	let timer: ReturnType<typeof setInterval>;

	const updateCountdown = () => {
		const now = dayjs();
		const end = dayjs(endDate);
		const diff = end.diff(now);

		if (diff <= 0) {
			clearInterval(timer);
			set({ d: 0, h: 0, m: 0, s: 0 });
			return;
		}

		const dur = dayjs.duration(diff);
		const days = dur.days() + dur.months() * 30 + dur.years() * 365;

		set({
			d: days,
			h: dur.hours(),
			m: dur.minutes(),
			s: dur.seconds()
		});
	};

	updateCountdown();
	timer = setInterval(updateCountdown, 1000);

	return {
		subscribe,
		stop: () => clearInterval(timer)
	};
};
