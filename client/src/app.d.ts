import type { Dayjs } from 'dayjs';
import { facilitatorRegions, gcsbPrograms } from '$lib/config';

declare global {
	namespace App {
		export type FacilitatorRegion = (typeof facilitatorRegions)[number];
		export type GCPProgram = (typeof gcsbPrograms)[number];

		export interface UserInfo {
			avatar: string;
			name: string;
			uuid: string;
		}

		interface BasicCourse {
			title: string;
			courseid: number;
			badgeurl: string;
		}

		export interface UserCourses extends BasicCourse {
			date: Dayjs | Date | string;
			type: 'skill' | 'game';
		}

		export interface CourseItem extends BasicCourse {
			badgeid: number;
			earnDate?: Dayjs | Date | string;
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

		export interface InitData {
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
		export interface SourceCourses extends UserCourses {
			type: 'skill' | 'completion';
			required?: boolean;
		}

		export interface CourseList {
			courses: (UserCourses & SourceCourses & { validity: boolean })[];
			group: string;
			title: string;
		}

		export interface DataScheme {
			group: string;
			title: string;
			list: CourseList[];
		}
	}
}

export {};
