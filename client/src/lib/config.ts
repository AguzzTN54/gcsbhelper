export const facilitatorRegions = ['india', 'indonesia', 'unset'] as const;
export const gcsbPrograms = ['arcade', 'juaragcp'] as const;

type Periode = { start: string; end: string };
export const arcadeSeason: Periode & { seasonid: string } = {
	seasonid: 'arcade_2024h2',
	start: '01 July 2025',
	end: '31 December 2025'
};

export const facilitatorPeriode: Partial<Record<App.FacilitatorRegion, Periode>> = {
	indonesia: {
		start: '2025-07-15T02:00:00Z',
		end: '2025-09-09T16:59:00Z'
	},
	india: {
		start: '2025-08-04T11:30:00Z',
		end: '2025-10-06T18:29:00Z'
	}
};
