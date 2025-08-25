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

const checkStoredProfile = async (hexuuid: string): Promise<{ earned: string[]; facilitator?: string }> => {
  try {
    const { earned_courses, facilitator } = await pb('/api/collections/profiles/records/' + hexuuid);
    const earned = earned_courses || [];
    return { earned, facilitator };
  } catch (err) {
    const e = err as Record<string, string>;
    if (e?.message?.match(/"status":404/)) return { earned: [] };
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

const insertNewCourses = async (
  hexuuid: string,
  newCourses: UserCourses[],
  facilitator?: string,
): Promise<PBBatchResponse[]> => {
  const requests: PBBatchRequest[] = [
    {
      method: 'PUT',
      url: '/api/collections/profiles/records',
      body: { id: hexuuid, facilitator: facilitator || null },
    },
  ];

  for (const { courseid, date } of newCourses) {
    const item: PBBatchRequest = {
      method: 'PUT',
      url: '/api/collections/course_enrollments/records',
      body: {
        id: await shortShaId(`${hexuuid}${courseid}`),
        profile: hexuuid,
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

const deleteUnEarnedCourse = async (hexuuid: string, courseids: string[]) => {
  const courseFilter = courseids.map((id) => `course='${id}'`).join('||');
  const filter = encodeURIComponent(`((${courseFilter})&&profile='${hexuuid}')`);
  const { items = [] } = await pb('/api/collections/course_enrollments/records?filter=' + filter);
  if (items.length < 1) return;

  const requests: PBBatchRequest[] = items.map(({ id }: { id: string }) => ({
    method: 'DELETE',
    url: '/api/collections/course_enrollments/records/' + id,
  }));
  await pb('/api/batch', 'POST', { requests });
};

const updateProfileCourseList = async (
  hexuuid: string,
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
    await pb('/api/collections/profiles/records/' + hexuuid, 'PATCH', payload);
  } catch (e) {
    console.error(e);
  }
};

const updateFacil = async (hexuuid: string, facil?: string) => {
  try {
    const facilitator = facil || null;
    await pb('/api/collections/profiles/records/' + hexuuid, 'PATCH', { facilitator });
  } catch (e) {
    console.error(e);
  }
};

export const updateProfilePB = async (data: ParsedDOM, program?: string, facilitator?: string) => {
  if (!data) return;
  const { courses, user } = data || {};
  const hexuuid = await shortShaId(`${user.uuid}-${program || ''}`);
  try {
    await validateCourse(courses);
    const { earned, facilitator: savedFacil } = await checkStoredProfile(hexuuid);
    const newEarnedCourses: UserCourses[] = [];
    for (const course of courses) {
      const shaId = await shortShaId(`${course.courseid}`);
      const isExist = earned.includes(shaId);
      if (isExist) continue;
      newEarnedCourses.push(course);
    }

    const deletedCourses: string[] = [];
    for (const course of earned) {
      let exist = false;
      for (const { courseid } of courses) {
        if ((await shortShaId(`${courseid}`)) === course) {
          exist = true;
          break;
        }
      }
      if (!exist) deletedCourses.push(course);
    }

    if (deletedCourses.length > 0) deleteUnEarnedCourse(hexuuid, deletedCourses);
    if (newEarnedCourses.length < 1 && deletedCourses.length < 1) {
      if (facilitator !== savedFacil) await updateFacil(hexuuid, facilitator);
      console.log(hexuuid, 'No update detected');
      return;
    }
    const insertResult = await insertNewCourses(hexuuid, newEarnedCourses, facilitator);
    await updateProfileCourseList(hexuuid, earned, insertResult, deletedCourses);
  } catch (e) {
    console.error(e);
  }
};
