import { type PushSubscription } from 'https://esm.sh/@types/web-push@3.6.4/index.js';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { db } from './lib/db/denoKv.ts';
import { createToken, verifyToken } from './lib//utils/hash.ts';
import { scrapAndNotify } from './lib/scrapAndNotify.ts';
import { profileScrapper } from './lib/scrapper/profileParser.ts';

const CLIENT_ORIGIN = Deno.env.get('CLIENT_HOST')?.split(',');
const app = new Hono();

app.use('*', async (c, next) => {
  const origin = c.req.header('origin');
  const userAgent = c.req.header('user-agent');
  if (!origin || !CLIENT_ORIGIN?.includes(origin) || !userAgent) {
    return c.json({ error: 'Forbidden' }, 403);
  }
  await next();
});

app.use(
  '*',
  cors({
    origin: CLIENT_ORIGIN || '',
    allowHeaders: ['Content-Type', 'X-Subscribe-Token'],
    allowMethods: ['GET', 'POST'],
    maxAge: 3600,
  }),
);

// Endpoint to get temporary token
app.get('/api/getToken', async (c) => {
  const token = await createToken();
  return c.json({ token });
});

app.get('/api/profile/:id', async (c) => {
  const token = c.req.header('x-subscribe-token');
  if (!token || !(await verifyToken(token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const id = c.req.param('id');
  const data = await profileScrapper(id);
  return c.json(data);
});

// Endpoint to receive subscription
app.post('/api/subscribe', async (c) => {
  const token = c.req.header('x-subscribe-token');
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

