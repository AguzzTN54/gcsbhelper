import { writable } from 'svelte/store';

export const arcadeProfile = writable({ profileid: '', name: '' });
export const arcadeBadges = writable({});
export const pointList = writable({});

export const juaraProfile = writable({ profileid: '', name: '' });
export const juaraBadges = writable([] as App.DataScheme[]);
