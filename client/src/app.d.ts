import type { Dayjs } from 'dayjs';
import { FacilitatorRegions } from '$lib/config';

declare global {
	namespace App {
		export type FacilitatorRegion = (typeof FacilitatorRegions)[number];

		export interface UserCourses {
			courseID: number;
			courseName: string;
			date?: Dayjs | Date | string;
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

		export interface ProfileData {
			profileID: string;
			user: string;
			courses: UserCourses[];
		}
	}
}

export {};
