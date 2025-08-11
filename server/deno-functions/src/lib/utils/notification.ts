import webPush from 'https://esm.sh/web-push';
import { db, type ArcadeContent } from '../db/denoKv.ts';

const PUBLIC_VAPID_KEY = Deno.env.get('PUBLIC_VAPID_KEY') || '';
const PRIVATE_VAPID_KEY = Deno.env.get('PRIVATE_VAPID_KEY') || '';

webPush.setVapidDetails('mailto:you@example.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

const sendToAllClient = async (payload: string) => {
  let sent = 0;
  let removed = 0;

  for (const sub of await db.getPushSubscriptions()) {
    try {
      await webPush.sendNotification(sub.value, payload);
      sent++;
    } catch (e) {
      const err = e as { message: string; statusCode: number };
      const { endpoint } = sub.value;
      // console.warn(`❌ Failed to send to ${endpoint}: ${err?.message}`);

      // Remove unsubscribed or invalid endpoints
      if (err.statusCode === 410 || err.statusCode === 404) {
        await db.removeSubscription(sub.key);
        removed++;
        console.log(`🧹 Removed invalid subscription: ${endpoint}`);
      }
    }
  }

  console.log(`✔️  Sent to ${sent} clients. 🧹 Removed ${removed} invalid subscriptions.`);
};

const arcadeURL = `https://go.cloudskillsboost.google/arcade`;
const RSVPURL = 'https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus';

export const sendNotification = async (content: ArcadeContent[]) => {
  if (Array.isArray(content) && content.length < 1) return;
  const { image, title, point } = content[0] || {};
  const url = title && image?.id ? arcadeURL : RSVPURL;

  if (content.length === 1) {
    const payload = JSON.stringify({
      title: `New Game Just Dropped! 🎮`,
      body: `Complete the ${title} badge and get ${point || ''} more point`,
      icon: image,
      url,
    });
    return await sendToAllClient(payload);
  }

  const payload = JSON.stringify({
    title: `New Games Just Dropped! 🎮`,
    body: `${content.length} New Games have just launched. Dive in now!`,
    icon: image,
    url,
  });

  return await sendToAllClient(payload);
};

