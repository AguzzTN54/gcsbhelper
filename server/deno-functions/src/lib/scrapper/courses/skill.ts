// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import type { Course, CourseContent } from './courses.d.ts';
import { shortShaId } from '../../utils/hash.ts';

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
}
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
    const list: CourseContent[] = modulesAttr ? JSON.parse(modulesAttr) : [];
    const totallab = list[0].steps.length || 0;
    const result = { fasttrack, badgeurl, totallab };
    return result;
  } catch {
    return { fasttrack: false, badgeurl: '', totallab: 0 };
  }
};

const insertToPb = async (course: Course & MoreCourseDetail) => {
  const { title, path, level, totallab, fasttrack, badgeurl } = course || {};
  try {
    const [, , idParam] = path.split('/');
    const [stringId] = idParam.split('?');
    const courseid = parseInt(stringId, 10);
    const id = await shortShaId(stringId);

    const data = {
      requests: [
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
            type: 'skill',
            point: 0.5,
          },
        },
      ],
    };

    const token = Deno.env.get('PB_TOKEN') || '';
    const pbHost = Deno.env.get('PB_HOST') || 'http://localhost:8090';
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
  } catch (e) {
    console.error(`❌ Failed to insert ${title}`, { cause: e });
  }
};

export const loadSkillbadges = async () => {
  const data = await fetchSkillbadges();
  console.log('🗃️  Data received, batch inser to PB');

  let i = 1;
  for (const content of data) {
    const moreDetails = await fetchCourseDetail(content);
    console.log(`🚀 (${i}) Inserting "${content.title}" to PB`);
    await insertToPb({ ...content, ...moreDetails });
    i++;
    await delay(0.5);
  }

  console.log('✔️ Task Finished');
};

await loadSkillbadges();
