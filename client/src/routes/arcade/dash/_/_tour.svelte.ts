import lstorage, { localAccounts } from '$lib/helpers/localstorage';
import { loadSteps, screenSize } from '$lib/stores/app.svelte';
import { startTour } from '$reusable/Tour.svelte';

let isMobile = $state(false);
screenSize.subscribe(({ width }) => (isMobile = width <= 640));
const mainContainer = $derived(
	(!isMobile ? '#rightpane' : '#dash') + ' > div[data-overlayscrollbars-viewport]'
);

const tourBegin = (unlistLabelTour: boolean) => {
	const isTourComlete = lstorage.get('arcadeTourComplete');
	const isUnlistLabelTourComplete = lstorage.get('arcadeUnlistedBadgeTour');
	if (isTourComlete && isUnlistLabelTourComplete) return;
	if (unlistLabelTour && isUnlistLabelTourComplete) return;

	const tourObject = [
		...(isTourComlete
			? []
			: [
					{
						element: '#select-milestone',
						message: 'Check all Available Milestones and progress',
						container: mainContainer
					}
				]),
		...(unlistLabelTour && !isUnlistLabelTourComplete
			? [
					{
						element: '#label-unknown',
						message:
							'You have badges that are not included in our system. Please check and review them!',
						container: mainContainer,
						navigation: false,
						navigateOnTargetClick: true
					},
					{
						element: '.labelpicker',
						message:
							'You can change the badge label if this badge should be included in the calculation',
						container: mainContainer,
						dynamic: true,
						navigation: false,
						navigateOnTargetClick: true
					},
					{
						element: '.label-selection',
						container: mainContainer,
						message: 'Select the correct label for this badge!',
						dynamic: true,
						navigateOnTargetClick: true,
						navigation: { back: false, next: true },
						onclick: () => lstorage.set('arcadeUnlistedBadgeTour', true)
					}
				]
			: []),
		...(isTourComlete
			? []
			: [
					{
						element: '#action-notify',
						message: 'Turn on notifications to get notified when new games are available!',
						navigateOnTargetClick: true,
						navigation: { back: false, next: true },
						onclick: () => lstorage.set('arcadeTourComplete', true)
					}
				])
	];

	if (tourObject.length === 0) return;
	startTour(tourObject);
};

let unlistLabelTour = $state(false);
let profileid = $state('');
export const initTour = (labels: string[]) => {
	unlistLabelTour = labels.includes('unknown');
};

$effect.root(() => {
	$effect(() => {
		const loadingsteps = Object.values(loadSteps);
		const { uuid } = localAccounts.getActive() || {};
		if (uuid === profileid) return;
		if (loadingsteps.includes(false)) return;
		profileid = uuid || '';

		const t = setTimeout(() => {
			clearTimeout(t);
			tourBegin(unlistLabelTour);
		}, 1500);
	});
});
