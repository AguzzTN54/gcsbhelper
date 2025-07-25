import { type PushSubscription } from 'https://esm.sh/@types/web-push@3.6.4/index.js';
import { sha256 } from './hash.ts';

export interface ImageThumb {
  id: string;
  slug: string;
}
export interface ArcadeContent {
  id: number;
  title: string;
  point: number;
  token: string;
  image: ImageThumb;
  addedAt: Date | string;
}
interface DBData {
  periode: number;
  lastUpdate: string | Date;
  hash: string;
  arcade: ArcadeContent[];
}

const arcadeKey = ['arcade_list'];
const DENO_KV_ID = Deno.env.get('DENO_KV_ID') || '';
const DENO_KV_URL = `https://api.deno.com/databases/${DENO_KV_ID}/connect`;
const isDenoDeploy = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;
const kv = await Deno.openKv(isDenoDeploy ? undefined : DENO_KV_URL);

export const db = {
  initData: (): DBData => {
    const data: DBData = {
      hash: '',
      lastUpdate: new Date(),
      periode: new Date().getMonth() + 1,
      arcade: [],
    };
    return data;
  },

  getAll: async (): Promise<DBData> => {
    const res = await kv.get<DBData | null>(arcadeKey);
    return res?.value ?? db.initData();
  },

  update: async (data: { arcade: ArcadeContent[]; hash: string }) => {
    const { arcade, hash } = data;
    const content: DBData = {
      hash,
      lastUpdate: new Date(),
      periode: new Date().getMonth() + 1,
      arcade,
    };
    await kv.set(arcadeKey, content);
  },

  // Store Push Subscriptions
  addSubscription: async (sub: PushSubscription) => {
    const key = ['subs', await sha256(sub.endpoint)];
    await kv.set(key, sub);
  },
  getPushSubscriptions: async (): Promise<Deno.KvEntry<PushSubscription>[]> => {
    const allSubs: Deno.KvEntry<PushSubscription>[] = [];
    for await (const entry of kv.list<PushSubscription>({ prefix: ['subs'] })) {
      allSubs.push(entry);
    }
    return allSubs;
  },
  removeSubscription: async (key: Deno.KvKey) => {
    await kv.delete(key);
  },
};

