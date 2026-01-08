import { arcadeRewards } from '$lib/data/config';

const checkTier = (total: number) => {
	return Object.entries(arcadeRewards)
		.filter(([_, value]) => total >= value)
		.pop()?.[0];
};

export const POINT_TABLE: Record<string, number> = {
	game: 1,
	trivia: 1,
	skill: 0.5,
	labfree: 0,
	wmp: 0,
	special: 2
};

const VALID_POINT_TYPES = new Set(['game', 'trivia', 'skill', 'wmp', 'labfree']);

const isValidTypeValue = (v?: string | null) => {
	return typeof v === 'string' && v.trim() !== '' && v.trim().toLowerCase() !== 'unknown';
};

const resolveType = (c: App.CourseItem): App.CourseType | 'special' => {
	if (isValidTypeValue(c.type)) return c.type;
	if (isValidTypeValue(c.userinput?.label)) return c.userinput?.label || null;
	return null;
};

export const calculatePoints = (
	courses: App.CourseItem[],
	facilMetadata?: App.FacilMetadata
): App.ArcadeStats => {
	// initial containers
	const points: App.ArcadeStats['points'] = { game: 0, trivia: 0, skill: 0, wmp: 0 };
	let wmpCount = 0;
	let totalbadges = 0;

	// accumulate arcade points
	for (const c of courses) {
		const t = resolveType(c);
		if (!t || t === 'labfree') continue;
		if (!c.validity?.arcade) continue; // only arcade-valid courses count for arcade points

		totalbadges++;

		if (t === 'wmp') {
			wmpCount++;
			continue;
		}

		if (t === 'special') {
			points.game += POINT_TABLE.special;
			continue;
		}

		// normal types: game, trivia, skill
		if (VALID_POINT_TYPES.has(t)) {
			// ex: 'game'|'trivia'|'skill' -> safe cast
			points[t as keyof typeof points] += !c.userinput?.label
				? (c.point ?? 0)
				: (POINT_TABLE[t] ?? 0);
		}
	}

	// apply WMP bonus (same as original logic)
	points.wmp = wmpCount >= 6 ? 7 : 0;

	// compute totals & tier
	const total = Object.values(points).reduce((s, n) => s + n, 0);
	const tier = checkTier(total);

	// if no region/unset -> return base arcade result
	if (!facilMetadata?.metadata?.data) {
		return {
			points,
			total,
			tier,
			complete: { facil: { wmp: wmpCount }, arcade: totalbadges },
			bonus: 0
		};
	}

	// facilitator-specific counting (use resolved type; special counts as game)
	const facilitatorCourses = courses.filter((c) => !!c.validity?.facilitator);
	const typeCounts = facilitatorCourses.reduce(
		(acc, c) => {
			const t = resolveType(c);
			if (!t) return acc;

			if (t === 'special') acc.game++;
			else if (t === 'labfree') acc.labfree++;
			else if (t === 'game' || t === 'trivia' || t === 'skill') acc[t]++;

			return acc;
		},
		{ game: 0, trivia: 0, skill: 0, labfree: 0 }
	);

	// milestone bonuses
	let bonus = 0;
	const achieved: string[] = [];
	const milestones = facilMetadata.metadata.data || {};

	for (const key in milestones) {
		const m = milestones[key];
		if (
			typeCounts.game >= m.game &&
			typeCounts.trivia >= m.trivia &&
			typeCounts.skill >= m.skill &&
			typeCounts.labfree >= (m.labfree || 0)
		) {
			bonus = m.bonus;
			achieved.push(m.displayname);
		}
	}

	return {
		points,
		bonus,
		total: total + bonus,
		complete: { facil: { ...typeCounts, wmp: wmpCount }, arcade: totalbadges },
		milestones: achieved,
		tier: checkTier(total + bonus)
	};
};
