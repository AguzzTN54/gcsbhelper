interface UserCourses {
  courseid: number;
  title: string;
  type: 'game' | 'skill';
  date: Date | string;
  badgeurl: string;
}

interface ArcadeMetadata {
  arcade: Record<string, unknown>;
  facilitator?: Record<string, unknown>;
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
  metadata?: ArcadeMetadata;
}
type ProfileData = ParsedDOM | { code: number; message: string; id: string };
