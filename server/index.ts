import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createToken, verifyToken } from './lib/hash.ts';

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

// Endpoint to receive subscription
app.post('/api/subscribe', async (c) => {
  const token = c.req.header('x-subscribe-token');
  if (!token || !(await verifyToken(token))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const data = await c.req.json();
  console.log('✅ Subscription saved:', data);
  return c.json({ success: true });
});

// Start the server
Deno.serve(app.fetch);

