import { writable } from 'svelte/store';
export const toastMsg = writable<App.Toast[]>([]);
export const screenSize = writable({ width: 0, height: 0 });

export const loadSteps = $state({
	profile: false,
	enrollmentdata: false,
	courselist: false,
	stats: false
});

type ConfigStore = App.InitData['metadata'] | undefined;
export const ARCADECONFIG = writable<ConfigStore>();

export const completedLabs = writable<Set<string>>();
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
export const juaraBadges = writable<App.JuaraBadge[]>([]);
