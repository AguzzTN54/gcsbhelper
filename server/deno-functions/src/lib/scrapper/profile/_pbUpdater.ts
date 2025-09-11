import { pb } from '../../db/pocketbase.ts';
import { shortShaId } from '../../utils/hash.ts';

const getCourseId = (courseid: number, type: 'game' | 'skill'): string => {
  const identifier = type === 'game' ? 'g' : 'c';
  const id = `${identifier}${courseid}`;
  return id;
};

const validateCourse = async (courses: UserCourses[]) => {
  const cids = courses.filter((c) => c.type === 'skill').map((c) => `courseid=${c.courseid}`);
  const bids = courses.filter((b) => b.type === 'game').map((c) => `badgeid=${c.courseid}`);
  const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
  const filter = encodeURIComponent(`(${filterid})`);

  let items = [];
  if (filterid) {
    ({ items } = await pb('/api/collections/courses/records?skipTotal=true&perPage=1000&filter=' + filter));
  }

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
        inactive: type === 'game',
        id: await shortShaId(getCourseId(courseid, type)),
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
  program?: string,
): Promise<PBBatchResponse[]> => {
  const requests: PBBatchRequest[] = [
    {
      method: 'PUT',
      url: '/api/collections/profiles/records',
      body: { id: hexuuid, facilitator: facilitator || null, program: program || null },
    },
  ];

  for (const { courseid, date, type } of newCourses) {
    const id = getCourseId(courseid, type);
    const item: PBBatchRequest = {
      method: 'PUT',
      url: '/api/collections/course_enrollments/records',
      body: {
        id: await shortShaId(`${hexuuid}${id}`),
        profile: hexuuid,
        course: await shortShaId(id),
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
  const { items = [] } = await pb('/api/collections/course_enrollments/records?skipTotal=true&filter=' + filter);
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
    return true;
  } catch (e) {
    console.error(e);
    return false;
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
      const { courseid, type } = course || {};
      const shaId = await shortShaId(getCourseId(courseid, type));
      const isExist = earned.includes(shaId);
      if (isExist) continue;
      newEarnedCourses.push(course);
    }

    const deletedCourses: string[] = [];
    for (const course of earned) {
      let exist = false;
      for (const { courseid, type } of courses) {
        if ((await shortShaId(getCourseId(courseid, type))) === course) {
          exist = true;
          break;
        }
      }
      if (!exist) deletedCourses.push(course);
    }

    if (deletedCourses.length > 0) deleteUnEarnedCourse(hexuuid, deletedCourses);

    // Change facilitator only if user changed their facilitor
    if (newEarnedCourses.length < 1 && deletedCourses.length < 1) {
      if (facilitator !== savedFacil && savedFacil !== undefined) {
        await updateFacil(hexuuid, facilitator);
      }
      console.log(hexuuid, savedFacil ? 'Empty Profile' : 'No update detected');
      return;
    }

    const insertResult = await insertNewCourses(hexuuid, newEarnedCourses, facilitator, program);
    await updateProfileCourseList(hexuuid, earned, insertResult, deletedCourses);
    console.log('Profile Updated: ' + hexuuid);
  } catch (e) {
    console.error(e);
  }
};
