export const facilitatorRegions = ['india', 'indonesia', 'unset'] as const;
export const gcsbPrograms = ['arcade', 'juaragcp'] as const;
export const arcadeSeason = '2024h2'; // Arcade Season in this year
export const arcadeEndIn = '31 December 2025';

export const facilitatorPeriode: Partial<
	Record<App.FacilitatorRegion, { start: string; end: string }>
> = {
	indonesia: {
		start: '2025-07-15T02:00:00Z',
		end: '2025-09-09T16:59:00Z'
	},
	india: {
		start: '2025-08-04T11:30:00Z',
		end: '2025-10-06T18:29:00Z'
	}
};
