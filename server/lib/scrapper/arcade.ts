// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';
import type { ArcadeContent } from '../db/denoKv.ts';

const parseImg = (ibb: string) => {
  if (!ibb) return '';
  const [, id, slug] = ibb.replace('//', '').split('/');
  return { id, slug };
};

const parseGameItem = (e: HTMLElement): ArcadeContent | null => {
  const image = parseImg(e.querySelector('img')?.src || '');
  const title = e.querySelector('.card-title')?.textContent?.trim();
  const link = e.querySelector('a')?.href;
  const [, gameId] = link?.match(/\/games\/(\d+)/) || [];
  const id = parseInt(gameId, 10);
  const text = e.textContent?.trim() || '';
  const [, token, p] = text.match(/Access code:\s*([^\s]+)[\s\S]*?Arcade points:\s*(\d+)/) || [];
  const point = parseInt(p, 10);
  if (!(id && title && image && token && point)) return null;
  return { id, title, token, point, image };
};

const parseGameData = (content: string) => {
  const { window } = new JSDOM(content || '');
  const card = window.document.querySelectorAll('.dark-back .card');
  const games: ArcadeContent[] = Array.from(card)
    .map((el) => el.parentElement)
    .map((e) => {
      if (!e) return null;
      const game = parseGameItem(e);
      return game || null;
    })
    .filter((v) => !!v);
  return games;
};

export const parseArcadePage = async (): Promise<ArcadeContent[] | null> => {
  try {
    const response = await fetch('https://go.cloudskillsboost.google/arcade');
    const text = await response.text();
    const { window } = new JSDOM(text);
    const container = window.document.querySelector('div[data-enable-interaction]');
    const content = container?.getAttribute('data-code');
    const data = parseGameData(content || '');
    return data;
  } catch {
    return null;
  }
};
