import { writable } from 'svelte/store';

export const arcadeProfile = writable({ profileID: null, name: null });
export const arcadeBadges = writable({});
export const pointList = writable({});
