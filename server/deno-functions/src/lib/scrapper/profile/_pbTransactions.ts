import { BatchService, RecordModel } from 'npm:pocketbase';
import pb from '../../db/pocketbase.ts';
import { shortShaId } from '../../utils/hash.ts';

const getCourseId = (courseid: number, type: 'game' | 'skill'): string => {
  const identifier = type === 'game' ? 'g' : 'c';
  const id = `${identifier}${courseid}`;
  return id;
};

const validateCourse = async (courses: UserCourses[]) => {
  if (!courses?.length) return;

  // Split array into chunks of maxSize
  const chunkArray = <T>(arr: T[], maxSize: number): T[][] =>
    arr.reduce((acc: T[][], _, i) => {
      if (i % maxSize === 0) acc.push(arr.slice(i, i + maxSize));
      return acc;
    }, []);

  // Build filter for one chunk
  const buildFilter = (chunk: UserCourses[]) => {
    const cids = chunk.filter((c) => c.type === 'skill').map((c) => `courseid="${c.courseid}"`);
    const bids = chunk.filter((b) => b.type === 'game').map((c) => `badgeid="${c.courseid}"`);
    const filterid = [bids.join('||'), cids.join('||')].filter((ids) => !!ids).join('||');
    return filterid;
  };

  const chunks = chunkArray(courses, 100);
  let items = [];

  try {
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const filter = buildFilter(chunk);
        if (!filter) return [];
        const res = await pb.collection('courses').getFullList({ filter, skipTotal: true, perPage: 1000 });
        return res || [];
      }),
    );

    items = results.flat();
  } catch (e) {
    console.error('Error validating courses:', e);
    return; // early exit, skip inserting
  }

  const missingCourses = courses.filter(({ courseid }) => {
    const isExist = items.find((c: Record<string, unknown>) => c.courseid === courseid || c.badgeid === courseid);
    return !isExist;
  });

  if (missingCourses.length < 1) return;
  await insertMissingCourses(missingCourses);
};

const insertMissingCourses = async (newCourses: UserCourses[]) => {
  const batch = pb.createBatch();
  for (const { courseid, type, title, badgeurl } of newCourses) {
    batch.collection('courses').create({
      title,
      badgeurl,
      inactive: type === 'game',
      id: await shortShaId(getCourseId(courseid, type)),
      ...(type === 'game' ? { badgeid: courseid } : { courseid }),
    });
  }
  await batch.send();
};

const checkStoredProfile = async (hexuuid: string): Promise<{ earned: string[]; facilitator?: string }> => {
  try {
    const { earned_courses, facilitator } = await pb.collection('event_profiles').getOne(hexuuid);
    const earned = earned_courses || [];
    return { earned, facilitator };
  } catch (err) {
    const e = err as Record<string, string | number>;
    if (e?.status === 404) return { earned: [] };
    throw e;
  }
};

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

const insertNewCourses = async (opt: {
  hexuuid: string;
  newCourses: UserCourses[];
  program: string;
  pid: string;
}): Promise<PBBatchResponse[]> => {
  const { hexuuid, newCourses, program, pid } = opt;
  const batch = pb.createBatch();
  batch.collection('event_profiles').upsert({ id: hexuuid, program: program || null, profile: pid });
  for (const { courseid, date, type } of newCourses) {
    const id = getCourseId(courseid, type);
    batch.collection('course_enrollments').upsert({
      id: await shortShaId(`${hexuuid}${id}`),
      profile: hexuuid,
      course: await shortShaId(id),
      earned: date,
    });
  }

  const data = await batch.send();
  return data as PBBatchResponse[];
};

const deleteUnEarnedCourse = async (hexuuid: string, courseids: string[], batch: BatchService) => {
  const courseFilter = courseids.map((id) => `course='${id}'`).join('||');
  const filter = encodeURIComponent(`((${courseFilter})&&profile='${hexuuid}')`);
  const items = (await pb.collection('course_enrollments').getFullList({ filter, skipTotal: true })) || [];
  if (items.length < 1) return;
  for (const { id } of items) {
    batch.collection('course_enrollments').delete(id);
  }
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
    await pb.collection('event_profiles').update(hexuuid, payload);
  } catch (e) {
    console.error(e);
  }
};

// const updateFacil = async (hexuuid: string, facil?: string) => {
//   try {
//     const facilitator = facil || null;
//     await pb.collection('event_profiles').update(hexuuid, { facilitator });
//     return true;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
// };

export const updateProfilePB = async (data: ParsedDOM, program: string) => {
  if (!data) return;
  const { courses, user } = data || {};
  const hexuuid = await shortShaId(`${user.uuid}-${program}`);
  const pid = await shortShaId(user.uuid);
  const batch = pb.createBatch();

  try {
    const progId = (await pb.collection('events').getFirstListItem(`identifier='${program}'`)).id;
    batch.collection('profiles').upsert({ id: pid, name: user.name, avatar: user.avatar, 'events+': progId });
  } catch {
    //
  }

  try {
    await validateCourse(courses);
    const { earned } = await checkStoredProfile(hexuuid);
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

    if (deletedCourses.length > 0) deleteUnEarnedCourse(hexuuid, deletedCourses, batch);
    if (newEarnedCourses.length < 1 && deletedCourses.length < 1) {
      console.log(user.uuid, 'No update detected');
      return batch.send();
    }

    await batch.send();
    const insertResult = await insertNewCourses({ hexuuid, newCourses: newEarnedCourses, program, pid });
    await updateProfileCourseList(hexuuid, earned, insertResult, deletedCourses);
    console.log(user.uuid, 'Profile Updated');
  } catch (e) {
    console.error(e);
  }
};

export const checkProfileEntities = async (
  uuid: string,
  program: string,
): Promise<{
  enrolled: unknown[];
  error?: boolean;
  status?: 'ENROLLED' | 'NOT_ENROLLED';
  message?: string;
  code?: number;
}> => {
  if (!uuid) throw new Error('No ID Attached');
  if (!program) throw new Error('No Program Attached');

  try {
    await pb.collection('events').getFirstListItem(`identifier='${program}'`);
  } catch (err) {
    const e = err as Record<string, string | number>;
    if (e.status === 404) throw new Error("There's no such Event in our system");
    throw e;
  }

  const pid = await shortShaId(uuid);
  let user: Partial<RecordModel> = {};
  try {
    user = await pb.collection('profiles').getOne(pid, { expand: 'events', fields: 'expand' });
  } catch (err) {
    const e = err as Record<string, string | number>;
    if (e?.status !== 404) throw e;
  }

  const recoredEvents = user?.expand?.events || [];
  const oldProgram = 'arcade2025_cohort2';
  const oldEventIncluded = recoredEvents.find((v: { identifier: string }) => v.identifier === oldProgram);

  // add arcade 2025 to event field when not yet included
  if (!oldEventIncluded) {
    try {
      const oldId = await shortShaId(`${uuid}-${oldProgram}`);
      const hasOld = await pb.collection('event_profiles').getOne(oldId);
      const oldEventIds = {
        india: 'fpv8pssuuzmcxsg',
        indonesia: 'yihvwopra98gm0q',
        arcade: 's9n2e5e8reboqua',
      };

      if (hasOld) {
        const eventToUpsert = [
          oldEventIds[hasOld.facilitator as keyof typeof oldEventIds] || '',
          oldEventIds.arcade,
        ].filter(Boolean);
        const batch = pb.createBatch();
        batch
          .collection('profiles')
          .upsert({ id: pid, identifier: oldId, title: 'Arcade 2025 2nd Half', 'events+': eventToUpsert });
        batch.collection('event_profiles').upsert({ id: oldId, profile: pid });
        await batch.send();
        recoredEvents.push({ identifier: oldProgram, title: 'Arcade 2025 2nd Half' });
      }
    } catch {
      //
    }
  }

  const eventString = recoredEvents.map((v: { identifier: string }) => v.identifier) || [];
  // If user enrolled, just update the current data in pb, so this fn return no error
  if (eventString.includes(program)) return { status: 'ENROLLED', enrolled: recoredEvents || [] };

  // If user not enrolled, tell the client, ask confirmation first
  return { status: 'NOT_ENROLLED', enrolled: recoredEvents || [] };
};

export const checkEventPeriode = async (uuid: string, program: string) => {
  const pid = await shortShaId(uuid);
  let event: RecordModel | undefined = undefined;
  try {
    const profileFilter = pb.filter('profiles_via_events.id?~{:pid}', { pid });
    const eventFilter = pb.filter('identifier={:program}', { program });
    event = await pb.collection('events').getFirstListItem([profileFilter, eventFilter].join('&&'));
  } catch {
    //
  }

  if (!event) return { enrolled: false };
  const { identifier, title, start, end } = event;
  return { enrolled: true, event: { identifier, title, start, end } };
};

export const loadEventProfile = async (uuid: string, program: string): Promise<ParsedDOM> => {
  const id = await shortShaId(`${uuid}-${program}`);
  const { expand, facilitator } = await pb
    .collection('event_profiles')
    .getOne(id, { expand: 'profile,profile.events,profile.events.events' });

  const events = expand?.profile?.expand?.events || [];
  const { expand: evExpand = [], ...arcadedata } =
    events?.find((v: { identifier: string }) => v.identifier === program) || {};

  const facildata = evExpand?.events?.find((v: { identifier: string }) => {
    return v.identifier.match(new RegExp(facilitator || 'unset', 'i'));
  });

  const earnedCourses = await pb
    .collection('course_enrollments')
    .getFullList({ filter: `profile='${id}'`, perPage: 1000, expand: 'course' });

  const courses = (earnedCourses || []).map(({ expand, earned: date }) => {
    const { badgeid, courseid, title, badgeurl } = expand?.course || {};
    const type: 'game' | 'skill' = badgeid ? 'game' : 'skill';
    return { courseid: badgeid || courseid, title, badgeurl, date, type };
  });

  const data: ParsedDOM = {
    code: 200,
    courses,
    user: {
      uuid,
      facilitator,
      avatar: expand?.profile?.avatar || '',
      name: expand?.profile?.name || 'Unamed Account',
    },
    metadata: {
      arcade: arcadedata,
      facilitator: facildata,
    },
  };
  return data;
};
