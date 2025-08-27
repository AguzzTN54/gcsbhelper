export const facilitatorRegions = ['india', 'indonesia', 'unset'] as const;
export const gcsbPrograms = ['arcade', 'juaragcp'] as const;

type Periode = { start: string; end: string };
export const arcadeSeason: Periode & { seasonid: string } = {
	seasonid: 'arcade_2024h2',
	start: '01 July 2025',
	end: '31 December 2025'
};

export const facilitatorPeriode: Record<Exclude<App.FacilitatorRegion, 'unset'>, Periode> = {
	indonesia: {
		start: '2025-07-15T02:00:00Z',
		end: '2025-09-09T16:59:00Z'
	},
	india: {
		start: '2025-08-04T11:30:00Z',
		end: '2025-10-06T18:29:00Z'
	}
};

interface MilestoneItem {
	displayname: string;
	game: number;
	skill: number;
	trivia: number;
	labfree?: number;
	bonus: number;
}
type Milestones = Record<string, MilestoneItem>;

export const facilMilestones: Record<Exclude<App.FacilitatorRegion, 'unset'>, Milestones> = {
	indonesia: {
		m1: {
			displayname: 'milestone.1',
			game: 4,
			trivia: 4,
			skill: 10,
			bonus: 5
		},
		m2: {
			displayname: 'milestone.2',
			game: 6,
			trivia: 6,
			skill: 20,
			bonus: 10
		},
		m3: {
			displayname: 'milestone.3',
			game: 8,
			trivia: 7,
			skill: 30,
			bonus: 15
		},
		m4: {
			displayname: 'Ultimate',
			game: 10,
			trivia: 8,
			skill: 44,
			bonus: 25
		}
	},
	india: {
		m1: {
			displayname: 'milestone.1',
			game: 6,
			trivia: 5,
			skill: 14,
			labfree: 6,
			bonus: 2
		},
		m2: {
			displayname: 'milestone.2',
			game: 8,
			trivia: 6,
			skill: 28,
			labfree: 12,
			bonus: 8
		},
		m3: {
			displayname: 'milestone.3',
			game: 10,
			trivia: 7,
			skill: 38,
			bonus: 15
		},
		m4: {
			displayname: 'Ultimate',
			game: 12,
			trivia: 8,
			skill: 52,
			bonus: 25
		}
	}
};
