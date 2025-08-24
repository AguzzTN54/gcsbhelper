import type { Dayjs } from 'dayjs';
import { facilitatorRegions, gcsbPrograms } from '$lib/config';

declare global {
	namespace App {
		export type FacilitatorRegion = (typeof facilitatorRegions)[number];
		export type GCPProgram = (typeof gcsbPrograms)[number];

		export interface UserInfo {
			avatar: string;
			name: string;
			profileid: string;
		}

		export interface UserCourses {
			title: string;
			courseid: number;
			date: Dayjs | Date | string;
			type: 'skill' | 'game';
			badgeurl: string;
		}

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

		export interface FetchedProfile {
			user: UserInfo;
			courses: UserCourses[];
		}
	}
}

export {};
