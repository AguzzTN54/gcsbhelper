import { JSDOM } from 'npm:jsdom';
import type { DecodedCourseData } from './types.d.ts';
import { shortShaId } from '../../utils/hash.ts';

// const labfreestr =
//   'https://www.cloudskillsboost.google/course_templates/1265?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1268?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/945?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/946?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/271?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/265?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/267?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/266?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1266?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1261?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/201?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/198?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/197?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/195?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/199?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/539?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1267?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1103?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/892?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1080?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1404?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/1069?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/388?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25https://www.cloudskillsboost.google/course_templates/196?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25';

const labfreestr =
  'https://www.skills.google/course_templates/1159https://www.skills.google/course_templates/1371https://www.skills.google/course_templates/1436https://www.skills.google/course_templates/1162https://www.skills.google/course_templates/1382https://www.skills.google/course_templates/1122https://www.skills.google/course_templates/1210https://www.skills.google/course_templates/1275https://www.skills.google/course_templates/881https://www.skills.google/course_templates/878https://www.skills.google/course_templates/882https://www.skills.google/course_templates/884https://www.skills.google/course_templates/886https://www.skills.google/course_templates/1147https://www.skills.google/course_templates/1385https://www.skills.google/course_templates/1166https://www.skills.google/course_templates/939https://www.skills.google/course_templates/391';

const labs = labfreestr
  .split('https://')
  .filter((v) => !!v)
  .map((v) => `https://${v}`);

const countQuizzes = (modules: DecodedCourseData[]) => {
  let count = 0;

  modules.forEach((module) => {
    if (module.steps) {
      module.steps.forEach((step) => {
        if (step.activities) {
          step.activities.forEach((activity) => {
            if ('type' in activity) {
              if (activity.type === 'quiz' || activity.type === 'lab') {
                count++;
              }
            }
          });
        }
      });
    }
  });

  return count;
};

const crawlCoursePage = async (url: string) => {
  const res = await fetch(url);
  const page = await res.text();
  const { window } = new JSDOM(page || '');
  const title = window.document.querySelector('h1.ql-display-small')?.textContent?.trim() || '';
  const listContainer = window.document.querySelector('ql-contents-menu');
  const modulesAttr = listContainer?.getAttribute('modules');
  const list: DecodedCourseData[] = modulesAttr ? JSON.parse(modulesAttr) : [];
  const totallab = countQuizzes(list);
  const badge = window.document.querySelector('img[role="presentation"]');
  const badgeurl = badge?.getAttribute('src') || '';

  return { title, totallab, badgeurl };
};

interface Course {
  title: string;
  totallab: number;
  badgeurl: string;
  id: string;
}

const insertToPb = async (course: Course) => {
  const { title, totallab, badgeurl, id: courseid } = course || {};
  try {
    const id = await shortShaId(`c${courseid}`);

    const data = {
      requests: [
        {
          method: 'PUT',
          url: '/api/collections/courses/records',
          body: {
            id,
            courseid: parseInt(courseid, 10),
            title,
            totallab,
            // badgeurl,
            // type: 'labfree',
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
    console.log('Added:', id, title);
  } catch (e) {
    console.error(`❌ Failed to insert ${title}`, { cause: e });
  }
};

let i = 0;
for (const lab of labs) {
  i++;
  // if (i > 1) break;
  const url = new URL(lab);
  const laburl = `${url.protocol}//${url.hostname}${url.pathname}`;

  const [id] = url.pathname.split('/').reverse();
  const data = await crawlCoursePage(laburl);
  await insertToPb({ ...data, id });
}

