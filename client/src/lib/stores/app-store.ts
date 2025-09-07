import { writable } from 'svelte/store';
export const toastMsg = writable<App.Toast[]>([]);

export const incompleteCalculation = writable<boolean>(false);
export const arcadeRegion = writable<App.FacilitatorRegion>('unset');
export const activeProfile = writable<App.UserInfo>();
export const initData = writable<App.CourseItem[]>([]);
export const profileReady = writable<boolean>(false);
export const arcadeStats = writable<App.ArcadeStats>();

export const arcadeProfile = writable({ profileID: '', name: '' });
export const arcadeBadges = writable({});
export const pointList = writable({});

export const juaraProfile = writable({ profileID: '', name: '' });
export const juaraBadges = writable([] as App.DataScheme[]);
