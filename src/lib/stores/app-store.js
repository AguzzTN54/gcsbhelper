import { writable } from 'svelte/store';

export const profile = writable({ profileID: null, name: null, type: 'arcade' });
export const badges = writable({});
export const pointList = writable({});
