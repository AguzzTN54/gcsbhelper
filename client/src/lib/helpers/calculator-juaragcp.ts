import { juaraTier } from '$lib/data/config';

const getValidBadges = (badges: App.JuaraBadge[], type: App.JuaraBadge['type']) => {
	return badges.filter((b) => b.type === type && b.date && b.validity);
};

interface JuaraTier {
	skill: number;
	completion: number;
	total: number;
	tier: string;
	isvalid: boolean;
}

export const whatIsMyTier = (badges: App.JuaraBadge[]): JuaraTier => {
	const skill = getValidBadges(badges, 'skill');
	const completion = getValidBadges(badges, 'completion');
	const mandatorybadge = badges.filter((j) => j.required && !j.validity && j.date);
	const isvalid = mandatorybadge.length < 1;

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

	return {
		total,
		isvalid,
		skill: skillCount,
		completion: completionCount,
		tier: isvalid ? tier : '##NotEligible!'
	};
};
