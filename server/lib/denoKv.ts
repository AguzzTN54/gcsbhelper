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
const kv = await Deno.openKv(`https://api.deno.com/databases/${DENO_KV_ID}/connect`);

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
};

