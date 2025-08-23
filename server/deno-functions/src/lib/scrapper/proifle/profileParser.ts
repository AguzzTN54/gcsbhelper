// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import { hexToUuid } from '../../utils/uuid.ts';
import { updateProfilePB } from './_pbUpdater.ts';

const toUTC = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string: ' + dateStr);
    }
    return date.toISOString();
  } catch (e) {
    console.error(e);
    return '';
  }
};

const parserFromDom = (htmlString: string, url: string): ParsedDOM => {
  const profileid = getProfileID(url);
  const { window } = new JSDOM(htmlString || '', { url });
  const courses: UserCourses[] = [];
  const badges = window.document.querySelectorAll('.profile-badge');
  badges.forEach((badgeEl) => {
    const dateEl = badgeEl.querySelector('.ql-body-medium.l-mbs');
    const [, dateTxt] = dateEl?.textContent?.split('Earned') || [];
    const date = toUTC(dateTxt.trim());

    const learnBTN = badgeEl.querySelector('ql-button');
    const modalID = learnBTN?.getAttribute('modal') || '';
    const modalElement = window.document.querySelector(`#${modalID}`);
    const title = modalElement?.getAttribute('headline') || '';

    const qlButton = modalElement?.querySelector('ql-button');
    const href = qlButton?.getAttribute('href');
    if (!href) return null;
    const [, tipe, id] = href.split('/');
    const courseid = parseInt(id, 10);
    const type = tipe === 'games' ? 'game' : 'skill';
    const badgeurl = badgeEl.querySelector('img')?.src || '';

    const itemData: UserCourses = { title, courseid, date, type, badgeurl };
    courses.push(itemData);
  });

  const userName = window.document.querySelector('h1')?.textContent?.trim() || '';
  const avatar = window.document.querySelector('ql-avatar')?.getAttribute('src') || '';
  const user = { name: userName, profileid, avatar };
  const result = { user, courses, code: 200 };
  return result;
};

const getProfileID = (profileURL: string) => {
  const url = new URL(profileURL);
  const [, , profileID] = url.pathname.split('/');
  return profileID;
};

type ScrapperOptions = { program?: string; save?: boolean; facilitator?: string };
export const profileScrapper = async (id: string, options?: ScrapperOptions) => {
  const { program, save, facilitator } = options || {};
  const gcsb = 'https://www.cloudskillsboost.google/public_profiles/';
  try {
    if (!id) throw new Error('No ID Attached');
    const uuid = hexToUuid(id);
    const url = gcsb + uuid;
    const profile = await fetch(url);
    const txt = await profile.text();
    const [, bd] = txt.split('<body');
    const [body] = bd?.split('</body>') || [''];
    if (!body) throw new Error();
    const parsed = parserFromDom(`<body>${body}</body>`, url);
    if (save) updateProfilePB(parsed, program, facilitator);
    return parsed;
  } catch (e) {
    console.log('Invalid ID', { cause: e });
    return { message: 'Invalid ID', code: 500 };
  }
};
