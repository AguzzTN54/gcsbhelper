import { JUARA_POINT_TABLE, juaraTier } from '$lib/data/config';

const getValidBadges = (badges: App.JuaraBadge[], type: App.JuaraBadge['type']) => {
	return badges.filter((b) => b.type === type && b.date && b.validity);
};

const checkValidAccount = (badges: App.JuaraBadge[]) => {
	const mandatorybadge = badges.filter((j) => j.required && !j.validity && j.date);
	const isvalid = mandatorybadge.length < 1;
	return isvalid;
};

interface Points {
	skill: number;
	completion: number;
	total: number;
}
interface JuaraTier extends Points {
	points: Points;
	tier: string;
	isvalid: boolean;
}

export const whatIsMyTier = (badges: App.JuaraBadge[]): JuaraTier => {
	const skill = getValidBadges(badges, 'skill');
	const completion = getValidBadges(badges, 'completion');
	const isvalid = checkValidAccount(badges);

	const skillCount = skill.length;
	const completionCount = completion.length;
	const total = skillCount + completionCount;

	let tier = 'notier';
	const sortedTiers = Object.entries(juaraTier).sort(
		([, a], [, b]) => a.total - b.total || a.skill - b.skill
	);

	for (const [name, req] of sortedTiers) {
		if (skillCount >= req.skill && total >= req.total) {
			tier = name;
		}
	}

	const skillpoint = (skillCount || 0) * JUARA_POINT_TABLE.skill;
	const completionpoint = (completionCount || 0) * JUARA_POINT_TABLE.completion;
	const totalpoint = skillpoint + completionpoint;
	const points = {
		skill: skillpoint,
		completion: completionpoint,
		total: totalpoint
	};

	return {
		total,
		isvalid,
		points,
		skill: skillCount,
		completion: completionCount,
		tier: isvalid ? tier : '##NotEligible!'
	};
};

const getPotentialBadge = (badges: App.JuaraBadge[], type: App.JuaraBadge['type']) => {
	return badges.filter((b) => b.type === type && ((b.date && b.validity) || !b.date));
};

export const analyzeBadges = (badges: App.JuaraBadge[]) => {
	const skill = getPotentialBadge(badges, 'skill');
	const completion = getPotentialBadge(badges, 'completion');
	const isvalid = checkValidAccount(badges);

	const skillCount = skill.length;
	const completionCount = completion.length;
	const total = skillCount + completionCount;

	const sortedTiers = Object.entries(juaraTier).sort(
		([, a], [, b]) => a.total - b.total || a.skill - b.skill
	);

	let tier = 'notier';
	let highestTierReq = null;

	for (const [name, req] of sortedTiers) {
		highestTierReq = req;
		if (skillCount >= req.skill && total >= req.total) {
			tier = name;
		}
	}

	let bonus = 0;
	if (tier !== 'notier' && tier === Object.keys(juaraTier).at(-1)) {
		bonus = skillCount - (highestTierReq?.skill ?? 0);
	}

	return {
		skill: skillCount,
		completion: completionCount,
		tier,
		bonus,
		isvalid
	};
};
