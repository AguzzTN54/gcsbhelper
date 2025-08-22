import { shortShaId } from '../../utils/hash.ts';

const token = Deno.env.get('PB_TOKEN') || '';
const pbHost = Deno.env.get('PB_HOST') || 'http://localhost:8090';

const validateCourse = async (courses: UserCourses[]) => {
  const res = await fetch(pbHost + '/api/collections/courses/records?perPage=300', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  if (res.status !== 200) throw new Error('Course Validation Error ' + res.status);
  const { items }: { items: { courseid: number; badgeid: number }[] } = await res.json();
  const missingCourses = courses.filter(({ courseid }) => {
    const isExist = items.find((c) => c.courseid === courseid || c.badgeid === courseid);
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

  const data = { requests };
  const res = await fetch(pbHost + '/api/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  const d = (await res.json()) || {};
  if (res.status !== 200) throw new Error(JSON.stringify(d));
};

const checkStoredProfile = async (pbid: string): Promise<string[]> => {
  const res = await fetch(pbHost + '/api/collections/profiles/records/' + pbid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  if (res.status !== 200 && res.status !== 404) throw new Error('PB Error ' + res.status);
  if (res.status === 404) return [];
  const { earned_courses } = await res.json();
  return earned_courses || [];
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

  const data = { requests };
  const res = await fetch(pbHost + '/api/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  const d = (await res.json()) || {};
  if (res.status !== 200) throw new Error(JSON.stringify(d));

  return d;
};

const deleteUnEarnedCourse = async (pbid: string, courseids: string[]) => {
  const courseFilter = courseids.map((id) => `course='${id}'`).join('||');
  const filter = encodeURIComponent(`((${courseFilter})&&profile='${pbid}')`);
  const res = await fetch(pbHost + '/api/collections/course_enrollments/records?filter=' + filter, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  if (res.status !== 200) throw new Error('Course Deletion Error ' + res.status);
  const { items = [] } = await res.json();
  if (items.length < 1) return;

  const requests: PBBatchRequest[] = items.map(({ id }: { id: string }) => ({
    method: 'DELETE',
    url: '/api/collections/course_enrollments/records/' + id,
  }));

  await fetch(pbHost + '/api/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ requests }),
  });
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
    await fetch(pbHost + '/api/collections/profiles/records/' + pbid, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ earned_courses: courseList }),
    });
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

