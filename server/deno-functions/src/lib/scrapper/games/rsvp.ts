// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import type { RSVPResponse } from './rsvp.d.ts';
import type { ImageThumb, ArcadeContent } from '../../db/denoKv.ts';

const parseKeyTokenFrom = async (url: string): Promise<string | null> => {
  if (!url) return null;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/endpoint\s*:\s*"https:\/\/rsvp\.googleapis\.com"[^}]*?apiKey\s*:\s*"([^"]+)"/);
  return match?.[1] || null;
};

const loadData = async (keyToken: string): Promise<RSVPResponse | null> => {
  const myHeaders = new Headers();
  myHeaders.append('referrer', 'https://rsvp.withgoogle.com');
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    slug: 'syllabus',
    state: 'LIVE',
  });

  const dataURL = new URL('https://content-rsvp.googleapis.com/v1/hydration/sites/arcade-facilitator:hydratePage');
  dataURL.searchParams.set('alt', 'json');
  dataURL.searchParams.set('key', keyToken);
  try {
    const res = await fetch(dataURL, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    });
    const data = await res.json();
    return data satisfies RSVPResponse;
  } catch {
    return null;
  }
};

const parseGameData = (data: RSVPResponse | null) => {
  if (!data) return;
  const list = data.sectionColumns.map(({ components }) => {
    const textComp = components[1]?.textComponent?.text || '';
    const { window } = new JSDOM(textComp);
    const token = window.document.querySelector('a')?.textContent;
    if (!token) return null;

    const { uri, linkUri } = components[0].imageComponent?.image || {};
    if (!linkUri) return null;

    try {
      const url = new URL(linkUri);
      const [, , gameId] = url.pathname.split('/');
      if (!(gameId && uri)) return null;
      const image: ImageThumb = { href: uri };
      const gameData = { id: parseInt(gameId, 10), token, image };
      return gameData;
    } catch {
      return null;
    }
  });

  const games: ArcadeContent[] = list.filter((v) => !!v);
  return games;
};

export const parseRSVPPage = async () => {
  try {
    const res = await fetch('https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus');
    const text = await res.text();
    const { window } = new JSDOM(text);
    const basejs = window.document.querySelector('#base-js');
    const src = basejs?.getAttribute('src');

    if (!src) return null;
    const keyToken = await parseKeyTokenFrom(src);
    if (!keyToken) return null;
    const data = parseGameData(await loadData(keyToken));
    return data;
  } catch {
    return null;
  }
};
