import { Octokit } from 'https://esm.sh/octokit?dts';

const TOKEN = Deno.env.get('GITHUB_TOKEN') || '';
const GIST_ID = Deno.env.get('GITHUB_GIST_ID') || '';
const octokit = new Octokit({ auth: TOKEN });

export interface ArcadeContent {
  id: number;
  title: string;
  point: number;
  token: string;
  image: string;
  addedAt: Date | string;
}
interface DBData {
  periode: number;
  lastUpdate: string | Date;
  hash: string;
  arcade: ArcadeContent[];
}

export const db = {
  getAll: async (): Promise<DBData | null> => {
    const { data } = await octokit.request(`GET /gists/${GIST_ID}`);
    if (!('arcade.json' in (data?.files || {}))) {
      throw new Error('Please create a new gist with "arcade.json" file!');
    }
    const { content } = data.files['arcade.json'] || {};
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('Please create a valid JSON gist repository!');
    }
  },

  update: async (data: { arcade: ArcadeContent[]; hash: string }) => {
    const { arcade, hash } = data || {};
    const content: DBData = {
      hash,
      lastUpdate: new Date(),
      periode: new Date().getMonth() + 1,
      arcade,
    };
    await octokit.request(`PATCH /gists/${GIST_ID}`, {
      files: { 'arcade.json': { content: JSON.stringify(content) } },
    });
  },
};

