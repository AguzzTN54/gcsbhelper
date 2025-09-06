import type { Dayjs } from 'dayjs';
import { facilitatorRegions, gcsbPrograms } from '$lib/data/config';

declare global {
	namespace App {
		type FacilitatorRegion = (typeof facilitatorRegions)[number];
		type GCPProgram = (typeof gcsbPrograms)[number];

		interface ArcadeStats {
			points: {
				game: number;
				trivia: number;
				skill: number;
				wmp: number;
			};
			complete: {
				arcade: number;
				facil: {
					wmp: number;
					game?: number;
					trivia?: number;
					skill?: number;
					labfree?: number;
				};
			};
			total?: number;
			bonus?: number;
			milestones?: string[];
			tier?: string;
		}

		interface UserInfo {
			avatar: string;
			name: string;
			uuid: string;
		}

		interface BasicCourse {
			title: string;
			courseid: number;
			badgeurl: string;
		}

		interface UserCourses extends BasicCourse {
			date: Dayjs | Date | string;
			type: 'skill' | 'game';
		}

		interface CourseItem extends BasicCourse {
			badgeid: number;
			startdate?: Dayjs | Date | string;
			enddate?: Dayjs | Date | string;
			earndate?: Dayjs | Date | string;
			earned: boolean;
			fasttrack: boolean;
			inactive: boolean;
			level: string;
			point: number;
			token: string;
			totallab: number;
			type: 'skill' | 'game' | 'wmp' | 'trivia' | 'labfree' | 'completion' | null;
			validity?: {
				arcade: boolean;
				facilitator?: boolean;
			};
		}

		interface InitData {
			user: UserInfo;
			courses: CourseItem[];
		}

		type ToastType = 'info' | 'success' | 'error' | 'warning';
		interface Toast {
			message: string;
			id?: number;
			dismissible?: boolean;
			autoclose?: boolean;
			timeout?: number;
			type?: ToastType;
		}

		//  ======================================
		interface SourceCourses extends UserCourses {
			type: 'skill' | 'completion';
			required?: boolean;
		}

		interface CourseList {
			courses: (UserCourses & SourceCourses & { validity: boolean })[];
			group: string;
			title: string;
		}

		interface DataScheme {
			group: string;
			title: string;
			list: CourseList[];
		}
	}
}

export {};
