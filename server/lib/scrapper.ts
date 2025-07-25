// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import { db } from './github.ts';
import { compare, parseDiff } from './comparison.ts';
import { sendNotification } from './notification.ts';

const loadArcadePage = async (): Promise<string> => {
  const response = await fetch('https://go.cloudskillsboost.google/arcade');
  const text = await response.text();
  const { window } = new JSDOM(text);
  const container = window.document.querySelector('div[data-enable-interaction]');
  const content = container?.getAttribute('data-code');
  return content || '';
};

export const runChecking = async (): Promise<void> => {
  try {
    console.log('🗃️  Checking stored data...');
    const data = await db.getAll();

    // cancel if failed to get the stored data
    if (!data) {
      console.log('❌ Operation Canceled: No Data Found');
      return;
    }

    const { arcade, hash, periode } = data;
    const thisMonth = new Date().getMonth() + 1;
    // cancel checking if all games already out
    if (periode === thisMonth && arcade.length >= 12) {
      console.log('✔️ Task Finished: All Arcade in this month already released');
      return;
    }

    // crawl arcade page
    console.log('🌐 Fetching Arcade page...');
    const content = await loadArcadePage();
    const { window } = new JSDOM(content || '');
    const card = window.document.querySelectorAll('.dark-back .card');
    const nodelist = Array.from(card)
      .map((el) => el.parentElement)
      .filter((v) => !!v);

    console.log('⚖️  Comparing...');
    const { sameAsBefore, newHash } = await compare(nodelist, hash || '');
    // Stop Execution if no update
    if (sameAsBefore) {
      console.log('✔️ Task Finished: No Update This Time');
      return;
    }

    const diff = parseDiff(nodelist, arcade);
    if (diff.length < 1) {
      console.log('✔️ Task Finished: No New Game Available');
      return;
    }
    console.log(`🎮 Found ${diff.length} new game(s)`);
    console.log('🗄️ Updating database..');
    await db.update({ arcade: [...diff, ...arcade], hash: newHash });

    console.log('🔔 Sending Notification..');
    await sendNotification(diff);
    console.log('✔️ Task Finished: Notification Sent');
    return;
  } catch (e) {
    console.error('❌ Operation Canceled:', { cause: e });
  }
};

