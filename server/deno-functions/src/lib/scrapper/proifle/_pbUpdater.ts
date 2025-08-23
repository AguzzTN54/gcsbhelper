import { pb } from '../../db/pocketbase.ts';
import { shortShaId } from '../../utils/hash.ts';

const validateCourse = async (courses: UserCourses[]) => {
  const { items } = await pb('/api/collections/courses/records?perPage=300');
  const missingCourses = courses.filter(({ courseid }) => {
    const isExist = items.find((c: Record<string, unknown>) => c.courseid === courseid || c.badgeid === courseid);
    return !isExist;
  });

  if (missingCourses.length < 1) return;
  await insertMissingCourses(missingCourses);
};

const insertMissingCourses = async (newCourses: UserCourses[]) => {
  const requests: PBBatchRequest[] = [];
  for (const { courseid, type, title, badgeurl } of newCourses) {
    const item: PBBatchRequest = {
      method: 'POST',
      url: '/api/collections/courses/records',
      body: {
        title,
        badgeurl,
        id: await shortShaId(`${courseid}`),
        ...(type === 'game' ? { badgeid: courseid } : { courseid }),
      },
    };
    requests.push(item);
  }

  await pb('/api/batch', 'POST', { requests });
};

const checkStoredProfile = async (pbid: string): Promise<string[]> => {
  try {
    const { earned_courses } = await pb('/api/collections/profiles/records/' + pbid);
    return earned_courses || [];
  } catch (err) {
    const e = err as Record<string, string>;
    if (e?.message?.match(/"status":404/)) return [];
    throw e;
  }
};

interface PBBatchRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body: Record<string, unknown>;
}
interface PBBatchResponse {
  status: 200 | 403 | 400;
  body: {
    collectionId: string;
    collectionName: string;
    id: string;
    course: string;
    difficulty: string;
    earned: string;
  };
}

const insertNewCourses = async (pbid: string, newCourses: UserCourses[]): Promise<PBBatchResponse[]> => {
  const requests: PBBatchRequest[] = [
    {
      method: 'PUT',
      url: '/api/collections/profiles/records',
      body: { id: pbid },
    },
  ];

  for (const { courseid, date } of newCourses) {
    const item: PBBatchRequest = {
      method: 'PUT',
      url: '/api/collections/course_enrollments/records',
      body: {
        id: await shortShaId(`${pbid}${courseid}`),
        profile: pbid,
        course: await shortShaId(`${courseid}`),
        earned: date,
      },
    };
    requests.push(item);
  }

  const payload = { requests };
  const data = await pb('/api/batch', 'POST', payload);
  return data;
};

const deleteUnEarnedCourse = async (pbid: string, courseids: string[]) => {
  const courseFilter = courseids.map((id) => `course='${id}'`).join('||');
  const filter = encodeURIComponent(`((${courseFilter})&&profile='${pbid}')`);
  const { items = [] } = await pb('/api/collections/course_enrollments/records?filter=' + filter);
  if (items.length < 1) return;

  const requests: PBBatchRequest[] = items.map(({ id }: { id: string }) => ({
    method: 'DELETE',
    url: '/api/collections/course_enrollments/records/' + id,
  }));
  await pb('/api/batch', 'POST', { requests });
};

const updateProfileCourseList = async (
  pbid: string,
  currentEarned: string[],
  newcourses: PBBatchResponse[],
  deletedCourse: string[],
) => {
  try {
    const insertedCourses = newcourses.filter(
      ({ status, body }) => status === 200 && body.collectionName === 'course_enrollments',
    );
    if (insertedCourses.length < 1 && deletedCourse.length < 1) return;

    const newList = insertedCourses.map(({ body }) => body.course);
    const courseList = [...currentEarned.filter((c) => !deletedCourse.includes(c)), ...newList];
    const payload = { earned_courses: courseList };
    await pb('/api/collections/profiles/records/' + pbid, 'PATCH', payload);
  } catch (e) {
    console.error(e);
  }
};

export const updateProfilePB = async (data: ParsedDOM) => {
  if (!data) return;
  try {
    const { courses, user } = data || {};
    await validateCourse(courses);
    const pbid = await shortShaId(user.profileid);
    const earnedCourses = await checkStoredProfile(pbid);
    const newEarnedCourses: UserCourses[] = [];
    for (const course of courses) {
      const shaId = await shortShaId(`${course.courseid}`);
      const isExist = earnedCourses.includes(shaId);
      if (isExist) continue;
      newEarnedCourses.push(course);
    }

    const deletedCourses: string[] = [];
    for (const course of earnedCourses) {
      let exist = false;
      for (const { courseid } of courses) {
        if ((await shortShaId(`${courseid}`)) === course) {
          exist = true;
          break;
        }
      }
      if (!exist) deletedCourses.push(course);
    }

    if (deletedCourses.length > 0) deleteUnEarnedCourse(pbid, deletedCourses);
    if (newEarnedCourses.length < 1 && deletedCourses.length < 1) {
      console.log(pbid, 'No update detected');
      return;
    }
    const insertResult = await insertNewCourses(pbid, newEarnedCourses);
    await updateProfileCourseList(pbid, earnedCourses, insertResult, deletedCourses);
  } catch (e) {
    console.error(e);
  }
};

