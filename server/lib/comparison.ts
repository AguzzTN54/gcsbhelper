import { type ArcadeContent } from './github.ts';
import { sha256 } from './hash.ts';

export const compare = async (
  node: NodeList | HTMLElement[],
  oldHash?: string,
): Promise<{ sameAsBefore: boolean; newHash: string }> => {
  if (typeof oldHash === 'undefined') return { sameAsBefore: false, newHash: '' };
  const stringNode = [...node].map((n) => n.textContent).join(' ');
  const newHash = await sha256(stringNode);
  const sameAsBefore = newHash === oldHash;
  return { sameAsBefore, newHash };
};

const getImgUrl = (ibb: string) => {
  if (!ibb) return '';
  const [, id, slug] = ibb.replace('//', '').split('/');
  const url = `https://imagecdn.wishsimulator.app/cb/${id}/${slug}&w=250`;
  return url;
};

export const parseDiff = (node: NodeListOf<Element> | HTMLElement[], prevContent?: ArcadeContent[]) => {
  const newContent: ArcadeContent[] = [];
  node.forEach((e) => {
    try {
      const image = getImgUrl(e.querySelector('img')?.src || '');
      const title = e.querySelector('.card-title')?.textContent?.trim();
      const link = e.querySelector('a')?.href;
      const [, gameId] = link?.match(/\/games\/(\d+)/) || [];
      const id = parseInt(gameId, 10);
      const text = e.textContent?.trim() || '';
      const [, token, p] = text.match(/Access code:\s*([^\s]+)[\s\S]*?Arcade points:\s*(\d+)/) || [];
      const point = parseInt(p, 10);
      if (!(id && title && image && token && point)) return;

      // check new content
      const isStored = !!prevContent?.find(({ id: sid }) => sid === id);
      if (isStored) return;
      const addedAt = new Date();
      newContent.push({ id, title, token, point, addedAt, image });
    } catch {
      console.error('');
    }
  });

  return newContent;
};

