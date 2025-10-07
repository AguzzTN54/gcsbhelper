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
			badgeurl?: string;
		}

		interface UserCourses extends BasicCourse {
			date?: Dayjs | Date | string;
			type: 'skill' | 'game' | 'completion';
		}

		type CourseType = 'skill' | 'game' | 'wmp' | 'trivia' | 'labfree' | 'completion' | null;
		interface CourseStats {
			diff_easy: number;
			diff_hard: number;
			diff_medium: number;
			enrollment_count: number;
		}

		interface CourseItem extends BasicCourse {
			id?: string;
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
			type: CourseType;
			progress?: number;
			labs?: string[];
			stats?: CourseStats;
			userinput?: {
				label?: CourseType | 'special';
				rating?: 'easy' | 'medium' | 'hard' | null;
			};
			validity?: {
				arcade: boolean;
				facilitator?: boolean;
			};
		}

		interface InitData {
			code?: 200 | 400 | 403;
			token?: string;
			user: UserInfo;
			courses: UserCourses[];
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

		// JuaraGCP
		interface JuaraBadge {
			id?: string;
			courseid: number;
			title: string;
			type: 'skill' | 'completion';
			required?: boolean;
			badgeurl?: string;
			date?: Dayjs | Date | string;
			validity?: boolean;
			totallab?: number;
			enrollment_count?: number;
		}

		interface JuaraCalendar {
			date: dayjs.Dayjs;
			inCurrentMonth: boolean;
			today: boolean;
			start: boolean;
			end: boolean;
			eventRange: boolean;
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
