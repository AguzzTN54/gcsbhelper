// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import type { Course, DecodedCourseData } from './types.d.ts';
import { shortShaId } from '../../utils/hash.ts';
import { pb } from '../../db/pocketbase.ts';

const delay = (seconds: number) => {
  return new Promise<void>((resolve) => {
    const t = setTimeout(() => {
      resolve();
      clearTimeout(t);
    }, seconds * 1000);
  });
};

const gcsb = 'https://www.cloudskillsboost.google';
const fetchSkillbadges = async () => {
  try {
    const res = await fetch(
      gcsb + '/catalog/list?format%5B%5D=__any__&keywords=&locale=&skill-badge%5B%5D=skill-badge&page=1&per_page=100',
    );
    const data: Course[] = await res.json();
    return data;
  } catch {
    console.error('failed to load skillbadges');
    return [];
  }
};

interface MoreCourseDetail {
  fasttrack: boolean;
  totallab: number;
  badgeurl: string;
  labs: string[];
}

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
  return result.filter((t) => !!t);
};

const fetchCourseDetail = async ({ path }: Course) => {
  try {
    const res = await fetch(gcsb + path);
    const html = await res.text();
    const { window } = new JSDOM(html || '');
    const fasttrack =
      !!window.document.querySelector('.course-challenge-skip') ||
      !!window.document.querySelector('ql-button[modal="preassessment-modal"]');
    const badge = window.document.querySelector('img[role="presentation"]');
    const badgeurl = badge?.getAttribute('src') || '';

    const listContainer = window.document.querySelector('ql-course-outline');
    const modulesAttr = listContainer?.getAttribute('modules');
    const list = modulesAttr ? JSON.parse(modulesAttr) : [];
    const labs = getLabs(list);
    const totallab = labs.length;
    const result = { fasttrack, badgeurl, totallab, labs };
    return result;
  } catch {
    return { fasttrack: false, badgeurl: '', totallab: 0, labs: [] };
  }
};

const insertToPb = async (course: Course & MoreCourseDetail) => {
  const { title, path, level, totallab, fasttrack, badgeurl, labs } = course || {};
  try {
    const [, , idParam] = path.split('/');
    const [stringId] = idParam.split('?');
    const courseid = parseInt(stringId, 10);
    const id = await shortShaId('c' + stringId);

    const labrecords = labs?.map(async (title) => ({ id: await shortShaId(title), title }));
    const labData = (await Promise.all(labrecords || [])).flat();
    const labIds = labData.map((l) => l.id) || [];
    const labRequest = labData.map(({ id, title }) => ({
      method: 'PUT',
      url: '/api/collections/labs/records',
      body: { id, title },
    }));

    const requests = [
      ...labRequest,
      {
        method: 'PUT',
        url: '/api/collections/courses/records',
        body: {
          id,
          courseid,
          title,
          fasttrack,
          totallab,
          level,
          badgeurl,
          labs: labIds,
          type: 'skill',
          point: 0.5,
        },
      },
    ];

    await pb('/api/batch', 'POST', { requests });
  } catch (e) {
    console.error(`❌ Failed to insert ${title}`, { cause: e });
  }
};

export const loadSkillbadges = async () => {
  const data = await fetchSkillbadges();
  console.log('🗃️  Data received, batch inser to PB');

  let i = 0;
  for (const content of data) {
    // if (i > 1) break;
    const moreDetails = await fetchCourseDetail(content);
    console.log(`🚀 (${i}) Inserting "${content.title}" to PB`);
    await insertToPb({ ...content, ...moreDetails });
    i++;
    await delay(0.5);
  }

  console.log('✔️ Task Finished');
};

await loadSkillbadges();
