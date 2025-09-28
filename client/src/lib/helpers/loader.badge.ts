import pb, { login } from './pocketbase';

interface BasePB {
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
}

export type PBItem = BasePB & App.CourseItem;

interface LoadBadgeOptions {
	courses: App.UserCourses[];
	token?: string;
	uuid?: string;
	loadGivenCourseOnly?: boolean;
}

export const loadBadgeList = async (options: LoadBadgeOptions): Promise<PBItem[]> => {
	const { courses, token, uuid, loadGivenCourseOnly } = options;
	if (!token || !uuid) return [];
	if (!login(token)) return [];

	// Split array into chunks of maxSize
	const chunkArray = <T>(arr: T[], maxSize: number): T[][] =>
		arr.reduce((acc: T[][], _, i) => {
			if (i % maxSize === 0) acc.push(arr.slice(i, i + maxSize));
			return acc;
		}, []);

	// Build filters per chunk
	const buildFilter = (chunk: 'default' | App.UserCourses[]) => {
		if (chunk === 'default') return '(inactive=false&&type!=null)';
		const cids = chunk
			.filter((c) => c.type.match(/skill|completion/))
			.map((c) => `courseid=${c.courseid}`);
		const bids = chunk.filter((b) => b.type === 'game').map((c) => `badgeid=${c.courseid}`);
		const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
		return filterid;
	};

	// Split into 100-sized chunks
	const chunks: ('default' | App.UserCourses[])[] = [
		...chunkArray(courses, 100),
		...(loadGivenCourseOnly ? [] : ['default' as 'default'])
	];
	try {
		const results = await Promise.all(
			chunks.map(async (chunk, i) => {
				const filter = buildFilter(chunk);
				const courselist = await pb.collection('courses').getList(1, 500, {
					filter,
					requestKey: 'key' + i,
					skipTotal: true,
					expand: 'labs'
				});
				return courselist.items as unknown as PBItem[];
			})
		);

		// Flatten all results
		return results.flat();
	} catch (e) {
		console.error('Error loading courses:', e);
		return [];
	}
};
