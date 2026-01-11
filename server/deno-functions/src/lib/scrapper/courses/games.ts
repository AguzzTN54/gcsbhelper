// @deno-types="npm:@types/jsdom"
import { JSDOM, DOMWindow } from 'npm:jsdom';
import { type ArcadeContent } from '../../db/denoKv.ts';
import { shortShaId } from '../../utils/hash.ts';
import pb from '../../db/pocketbase.ts';
import { DecodedCourseData } from './types.d.ts';

const gcsb = 'https://www.cloudskillsboost.google';
interface GcsbData {
  badgeid: number;
  totallab: number;
  startdate: string | null | Date;
  enddate: string | null | Date;
  badgeurl: string;
  title: string;
  labs: string[];
}

const getDate = (window: DOMWindow, dateIndex: number = 0): string | null => {
  const time = window.document.querySelectorAll('ql-datetime')[dateIndex];
  const timeMS = time?.getAttribute('millisecondsSinceEpoch');
  const date = timeMS ? new Date(parseInt(timeMS)).toISOString() : null;
  return date;
};

const getLabs = (data: DecodedCourseData[]): string[] => {
  const result: string[] = [];
  data.forEach((item) => {
    if (!Array.isArray(item.steps) || item.title === "What's Next") return;
    item.steps.forEach((step) => {
      if (!Array.isArray(step.activities)) return;
      step.activities.forEach((activity) => {
        if (!activity.title) return;
        result.push(activity.title?.trim());
      });
    });
  });
  return result;
};

const crawlGamePage = async (id: number): Promise<GcsbData | null> => {
  try {
    const target = gcsb + '/games/' + id;
    const res = await fetch(target);
    const html = await res.text();
    const { window } = new JSDOM(html || '');
    const courseContent = window.document.querySelector('ql-course');
    const badgeid = parseInt(courseContent?.getAttribute('courseid') || '0');

    const title = window.document.querySelector('h1.ql-display-large')?.textContent?.trim() || '';
    const badgeurl = window.document.querySelector('.game__badge > img')?.getAttribute('src')?.trim() || '';

    const dataString = courseContent?.getAttribute('modules');
    const data = dataString ? JSON.parse(dataString) : [];
    const labs = getLabs(data);
    const totallab = labs.length;
    const startdate = getDate(window, 0);
    const enddate = getDate(window, 1);
    return { badgeid, totallab, startdate, enddate, badgeurl, title, labs };
  } catch (e) {
    console.error(e);
    return null;
  }
};

interface Course {
  courseid?: number;
  badgeid?: number;
  token?: string;
  title?: string;
  totallab?: number;
  labs?: string[];
  badgeurl?: string;
  type?: string;
  startdate?: string | Date | null;
  enddate?: string | Date | null;
  point?: number;
}

const insertToPb = async (course: Course) => {
  const { title, totallab, badgeurl, courseid, point, type, startdate, enddate, badgeid, token, labs } = course || {};
  if (!title || !badgeid) return;
  try {
    const id = await shortShaId(`g${badgeid}`);
    const labrecords = labs?.map(async (title) => ({ id: await shortShaId(title), title }));
    const labData = (await Promise.all(labrecords || [])).flat();
    const labIds = labData.map((l) => l.id) || [];

    const batch = pb.createBatch();
    for (const { id, title } of labData) {
      batch.collection('labs').upsert({ id, title });
    }

    batch.collection('courses').upsert({
      id,
      enddate,
      startdate,
      courseid,
      title,
      totallab,
      badgeurl,
      type,
      badgeid,
      token,
      point: point || 0,
      labs: labIds,
    });
    await batch.send({ requestKey: id });
  } catch (e) {
    console.error(`❌ Failed to insert ${title}`, { cause: e });
  }
};

const getType = (token: string, title?: string): string => {
  if (token.match(/trivia/)) return 'trivia';
  if (title?.match(/work meets play/i)) return 'wmp';
  return 'game';
};

export const addGameToPB = async (data: ArcadeContent[]) => {
  let i = 0;
  for (const content of data) {
    i++;
    // if (i > 1) break;
    const { id: courseid, token, point } = content || {};
    const fromgcsb = await crawlGamePage(courseid);
    const type = getType(token, fromgcsb?.title);
    await insertToPb({ courseid, token, point, type, ...(fromgcsb || {}) });
  }
  console.log('✔️ New Games Updated to PB');
};
