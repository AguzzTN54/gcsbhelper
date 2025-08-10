// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

interface UserCourses {
  courseid: number;
  title: string;
  date: Date | string;
}

interface ParsedDOM {
  user: { name: string; profileid: string };
  courses: UserCourses[];
}

const parserFromDom = (htmlString: string, url: string): ParsedDOM => {
  const profileid = getProfileID(url);
  const { window } = new JSDOM(htmlString || '', { url });
  const courses: UserCourses[] = [];
  const badges = window.document.querySelectorAll('.profile-badge');
  badges.forEach((badgeEl) => {
    const dateEl = badgeEl.querySelector('.ql-body-medium.l-mbs');
    const [, dateTxt] = dateEl?.textContent?.split('Earned') || [];
    const date = dateTxt.trim();

    const learnBTN = badgeEl.querySelector('ql-button');
    const modalID = learnBTN?.getAttribute('modal') || '';
    const modalElement = window.document.querySelector(`#${modalID}`);
    const title = modalElement?.getAttribute('headline') || '';

    const qlButton = modalElement?.querySelector('ql-button');
    const href = qlButton?.getAttribute('href');
    if (!href) return null;
    const [, , id] = href.split('/');
    const courseid = parseInt(id, 10);

    const itemData = { title, courseid, date };
    courses.push(itemData);
  });

  const userName = window.document.querySelector('h1')?.textContent?.trim() || '';
  const user = { name: userName, profileid };
  const result = { user, courses };
  return result;
};

const getProfileID = (profileURL: string) => {
  const url = new URL(profileURL);
  const [, , profileID] = url.pathname.split('/');
  return profileID;
};

export const profileScrapper = async (id: string) => {
  const gcsb = 'https://www.cloudskillsboost.google/public_profiles/';
  const url = gcsb + id;
  try {
    const profile = await fetch(url);
    const txt = await profile.text();
    const [, bd] = txt.split('<body');
    const [body] = bd.split('</body>');
    const parsed = parserFromDom(`<body>${body}</body>`, url);
    return parsed;
  } catch (e) {
    console.log(e);
    return { message: 'Invalid id', code: 500 };
  }
};

