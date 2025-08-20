import { type ArcadeContent } from '../db/denoKv.ts';

const assignNewProps = (arcade: ArcadeContent[], index: number, newProps: ArcadeContent): void => {
  const { image, title, point } = newProps || {};
  if (arcade[index]) {
    arcade[index].image.id = image.id;
    arcade[index].image.slug = image.slug;
    arcade[index].point = point;
    arcade[index].title = title;
  }
};

export const findDiff = (
  current: ArcadeContent[],
  prev: ArcadeContent[],
  diff?: ArcadeContent[],
): ArcadeContent[] | null => {
  const newContent: ArcadeContent[] = current
    .map((item) => {
      const stored = prev?.findIndex(({ id: sid }) => sid === item.id);
      // Modify only stored kv
      if (stored > -1) {
        assignNewProps(prev, stored, item);
        return false;
      }

      const addedAt = new Date();
      return { addedAt, ...item };
    })
    .filter((v) => !!v);

  if (Array.isArray(diff) && diff.length > 0) {
    diff.forEach((item) => {
      if (newContent.find(({ id }) => id === item.id)) return;
      const addedAt = new Date();
      const diffContent = { addedAt, ...item };
      newContent.push(diffContent);
    });
  }

  return newContent;
};

export const combine = (arr1: ArcadeContent[], arr2: ArcadeContent[]) => {
  const map = new Map<number, ArcadeContent>();
  [...arr1, ...arr2].forEach((item) => {
    map.set(item.id, item); // overwrite if duplicate id
  });

  return Array.from(map.values());
};

