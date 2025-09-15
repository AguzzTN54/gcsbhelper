import { db, type ArcadeContent } from './db/denoKv.ts';
import { combine, findDiff } from './utils/comparison.ts';
import { sendNotification } from './utils/notification.ts';
import { parseRSVPPage } from './scrapper/games/rsvp.ts';
import { parseArcadePage } from './scrapper/games/arcade.ts';
import { sha256 } from './utils/hash.ts';
import { addGameToPB } from './scrapper/courses/games.ts';

const crawlRSVP = true;

export const scrapAndNotify = async (): Promise<void> => {
  try {
    console.log(' ');
    console.log('🗃️  Checking stored data..');
    const data = await db.getAll();

    // cancel if failed to get the stored data
    if (!data) {
      console.log('❌ Operation Canceled: No Data Found');
      return;
    }

    const { arcade, periode, hash } = data;
    const thisMonth = new Date().getMonth() + 1;

    // cancel checking if all games already out
    // if (periode === thisMonth && arcade.length >= 11) {
    //   console.log('✔️  Task Finished: All Arcade in this month already released');
    //   return;
    // }

    // crawl RSVP page
    let diff: ArcadeContent[] = [];
    if (crawlRSVP) {
      console.log('🌐 Fetching RSVP page..');
      const rsvpContent = await parseRSVPPage();
      if (rsvpContent) {
        console.log('⚖️  Comparing From RSVP Page..');
        diff = findDiff(rsvpContent, arcade) || [];
        if (diff && diff.length < 1) {
          console.log('⭕ No New Game Retrieved from RSVP Page');
        } else {
          console.log(`🎮 Found ${diff.length} new game(s) from RSVP Page`);
        }
      }
    }

    // crawl arcade page
    console.log('🌐 Fetching Arcade page..');
    const arcadeContent = await parseArcadePage();

    if (!arcadeContent) return notifyAndUpdate(diff, arcade, hash);
    console.log('⚖️  Comparing From Arcade Page..');
    diff = findDiff(arcadeContent, arcade, diff) || [];
    return notifyAndUpdate(diff, periode === thisMonth ? arcade : [], hash);
  } catch (e) {
    console.error('❌ Operation Canceled:', { cause: e });
  }
};

const notifyAndUpdate = async (diff: ArcadeContent[], prev: ArcadeContent[] = [], hash: string) => {
  const combined = combine(diff, prev);
  const newHash = await sha256(JSON.stringify(combined));
  if (newHash !== hash) {
    console.log('🗄️  Updating database..');
    await db.update({ arcade: combined, hash: newHash });
  }

  if (diff.length < 1) {
    console.log('✔️  Task Finished: No Update This Time');
    return;
  }

  console.log(`🎮 Found Total ${diff.length} new game(s)`);
  console.log('🔔 Sending Notification..');
  await addGameToPB(diff);
  await sendNotification(diff);
  console.log('✔️  Task Finished');
  return;
};

// await scrapAndNotify();
