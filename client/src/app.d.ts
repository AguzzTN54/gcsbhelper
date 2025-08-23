import type { Dayjs } from 'dayjs';

declare global {
	namespace App {
		export interface UserCourses {
			courseid: number;
			title: string;
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
			user: {
				name: string
				profileid: string;
			};
			courses: UserCourses[];
		}
	}
}

export {};
