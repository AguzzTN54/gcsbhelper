import { type PushSubscription } from 'https://esm.sh/@types/web-push@3.6.4/index.js';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import type { ContentfulStatusCode } from 'npm:hono/utils/http-status';

import { db } from './lib/db/denoKv.ts';
import { shortShaId, verifyToken } from './lib//utils/hash.ts';
import { scrapAndNotify } from './lib/scrapAndNotify.ts';
import { profileScrapper } from './lib/scrapper/proifle/profileParser.ts';
import { updateFacil } from './lib/scrapper/proifle/_pbUpdater.ts';
import { hexToUuid } from './lib/utils/uuid.ts';

const CLIENT_ORIGIN = Deno.env.get('CLIENT_HOST')?.split(',');
const app = new Hono();

const rateLimitStore = new Map<string, { count: number; reset: number }>();
const limit = 50; // 100 req
const windowMs = 60_000; // per minute

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  let record = rateLimitStore.get(ip);
  if (!record || record.reset < now) {
    // reset counter
    record = { count: 0, reset: now + windowMs };
    rateLimitStore.set(ip, record);
  }

  record.count++;
  if (record.count > limit) {
    return c.text('Too Many Requests', 429);
  }

  c.header('X-RateLimit-Limit', limit.toString());
  c.header('X-RateLimit-Remaining', (limit - record.count).toString());
  c.header('X-RateLimit-Reset', Math.floor(record.reset / 1000).toString());

  await next();
});

app.use('*', async (c, next) => {
  const origin = c.req.header('origin');
  const userAgent = c.req.header('user-agent');
  if (!origin || !CLIENT_ORIGIN?.includes(origin) || !userAgent) {
    return c.json({ error: 'Who Are You? What Are you doing bruh?' }, 403);
  }
  await next();
});

app.use(
  '*',
  cors({
    origin: CLIENT_ORIGIN || '',
    allowHeaders: ['Content-Type', 'X-Arcade-Token'],
    allowMethods: ['GET', 'POST'],
    maxAge: 3600,
  }),
);

// Endpoint to get temporary token
// app.get('/api/getToken', async (c) => {
//   const token = await createToken();
//   return c.json({ token });
// });

app.get('/internal/identity', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const [time, token, id = ''] = arcadeToken?.split('.') || [];
  if (!token || !(await verifyToken(time + '.' + token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const program = (c.req.query('program') ?? '').trim();
  const region = (c.req.query('facilitator') ?? '').trim().toLowerCase();
  const facilitator = ['india', 'indonesia'].includes(region) ? region : undefined;
  const save = (c.req.query('save') ?? 'true').trim().toLowerCase() !== 'false';
  const data = await profileScrapper(id, { program, save, facilitator });

  if (data.code !== 200) {
    return c.json(data, data.code as ContentfulStatusCode);
  }
  return c.json(data);
});

app.post('/internal/switch', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const [time, token, id = ''] = arcadeToken?.split('.') || [];
  if (!token || !(await verifyToken(time + '.' + token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const parsed = await c.req.json<{ facilitator: string; program: string }>();
  const region = parsed?.facilitator?.trim().toLowerCase();
  const facilitator = ['india', 'indonesia'].includes(region) ? region : undefined;
  const uuid = hexToUuid(id);
  const pbHexid = await shortShaId(`${uuid}-${parsed?.program || ''}`);
  const isUpdated = await updateFacil(pbHexid, facilitator);
  if (isUpdated) return c.json({ success: true });
  return c.json({ success: false }, 500 as ContentfulStatusCode);
});

// Endpoint to receive subscription
app.post('/internal/subscribe', async (c) => {
  const token = c.req.header('x-arcade-token');
  if (!token || !(await verifyToken(token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const data: PushSubscription = await c.req.json();
  await db.addSubscription(data);
  return c.json({ success: true });
});

// Run every 5 minutes, run every Monday, tuesday and wednesday (Day expected of arcade release)
Deno.cron('Scrap and Notify', '*/5 * * * 2-4', async () => {
  await scrapAndNotify();
});

Deno.serve(app.fetch);
