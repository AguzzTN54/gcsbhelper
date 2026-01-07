interface UserCourses {
  courseid: number;
  title: string;
  type: 'game' | 'skill';
  date: Date | string;
  badgeurl: string;
}

interface ParsedDOM {
  code: number;
  user: {
    name: string;
    uuid: string;
    avatar: string;
    facilitator?: string;
  };
  courses: UserCourses[];
}
type ProfileData = ParsedDOM | { code: number; message: string };
