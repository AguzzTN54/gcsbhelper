import { type ArcadeContent } from './db/denoKv.ts';

const assignNewProps = (arcade: ArcadeContent[], index: number, newProps: ArcadeContent): void => {
  const { image, title, point } = newProps || {};
  arcade[index].image.id = image.id;
  arcade[index].image.slug = image.slug;
  arcade[index].point = point;
  arcade[index].title = title;
};

export const findDiff = (
  current: ArcadeContent[],
  prev: ArcadeContent[],
  diff?: ArcadeContent[],
): ArcadeContent[] | null => {
  const newContent: ArcadeContent[] = current
    .map((item) => {
      const stored = prev?.findIndex(({ id: sid }) => sid === item.id);
      const inDiff = diff?.find(({ id: sid }) => sid === item.id);

      if (stored > -1 || !!inDiff) {
        assignNewProps(prev, stored, item);
        return inDiff;
      }

      const addedAt = new Date();
      return { addedAt, ...item };
    })
    .filter((v) => !!v);
  return newContent;
};

