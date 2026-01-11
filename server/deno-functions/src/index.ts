import { type PushSubscription } from 'https://esm.sh/@types/web-push@3.6.4/index.js';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import type { ContentfulStatusCode } from 'npm:hono/utils/http-status';

import { db } from './lib/db/denoKv.ts';
import { verifyToken } from './lib//utils/hash.ts';
import { scrapAndNotify } from './lib/scrapAndNotify.ts';
import { loadProfile } from './lib/scrapper/profile/profileParser.ts';
import { getAccountToken } from './lib/db/pocketbase.ts';
import { hexToUuid } from './lib/utils/uuid.ts';
import { checkProfileEntities, checkRanking, updatePoints } from './lib/scrapper/profile/_pbTransactions.ts';

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
    allowHeaders: ['Content-Type', 'X-Arcade-Token', 'X-Arcade-Identity'],
    allowMethods: ['GET', 'POST'],
    maxAge: 3600,
  }),
);

// Endpoint to get temporary token
// app.get('/api/getToken', async (c) => {
//   const token = await createToken();
//   return c.json({ token });
// });

app.get('/internal/identity/:id/verifyseason', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const id = c.req.param('id') || '';
  if (!arcadeToken || !id || !(await verifyToken(arcadeToken))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const program = (c.req.query('program') ?? '').trim();
    const uuid = hexToUuid(id);
    const data = await checkProfileEntities(uuid, program);
    return c.json(data);
  } catch (error) {
    const e = error as Record<string, string | number>;
    console.error(e);
    return c.json({ error: e?.message || 'Something Went Wrong' }, 500);
  }
});

app.post('/internal/identity/:id/rank', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const id = c.req.param('id') || '';
  if (!arcadeToken || !id || !(await verifyToken(arcadeToken))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const program = (c.req.query('program') ?? '').trim();
    const uuid = hexToUuid(id);
    const input = await c.req.json();
    await updatePoints(uuid, program, input?.points || 0);
    return c.json({});
  } catch (error) {
    const e = error as Record<string, string | number>;
    console.error(e);
    return c.json({ error: e?.message || 'Something Went Wrong' }, 500);
  }
});

app.get('/internal/identity/:id/rank', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const id = c.req.param('id') || '';
  if (!arcadeToken || !id || !(await verifyToken(arcadeToken))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const program = (c.req.query('program') ?? '').trim();
    const uuid = hexToUuid(id);
    const data = await checkRanking(uuid, program);
    return c.json(data);
  } catch (error) {
    const e = error as Record<string, string | number>;
    console.error(e);
    return c.json({ error: e?.message || 'Something Went Wrong' }, 500);
  }
});

app.get('/internal/identity/:id', async (c) => {
  const arcadeToken = c.req.header('x-arcade-token');
  const id = c.req.param('id') || '';
  if (!arcadeToken || !id || !(await verifyToken(arcadeToken))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const program = (c.req.query('program') ?? '').trim();
  // const region = (c.req.query('facilitator') ?? '').trim().toLowerCase();
  // const facilitator = ['india', 'indonesia'].includes(region) ? region : undefined;
  const save = (c.req.query('save') ?? 'true').trim().toLowerCase() !== 'false';
  const tokenize = (c.req.query('tokenize') ?? 'true').trim().toLowerCase() !== 'false';

  const promise = await Promise.all([loadProfile(id, { program, save }), ...(tokenize ? [getAccountToken()] : [])]);
  const data = { ...(promise[0] || {}), token: promise[1] || '' };

  if (data.code !== 200) {
    return c.json(data, data.code as ContentfulStatusCode);
  }
  return c.json(data, 200, {
    'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
  });
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

app.post('/internal/unsubscribe', async (c) => {
  const token = c.req.header('x-arcade-token');
  if (!token || !(await verifyToken(token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const data: PushSubscription = await c.req.json();
  await db.removeSubscription(data);
  return c.json({ success: true });
});

// Run every 5 minutes, run every Monday, tuesday and wednesday (Day expected of arcade release)
Deno.cron('Scrap and Notify', '*/5 * * * 2-4', async () => {
  await scrapAndNotify();
});

Deno.serve(app.fetch);
