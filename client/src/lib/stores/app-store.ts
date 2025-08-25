import { writable } from 'svelte/store';

export const arcadeRegion = writable<App.FacilitatorRegion>('unset');
export const initData = writable<App.CourseItem[]>([]);

export const arcadeProfile = writable({ profileID: '', name: '' });
export const arcadeBadges = writable({});
export const pointList = writable({});

export const juaraProfile = writable({ profileID: '', name: '' });
export const juaraBadges = writable([] as App.DataScheme[]);
