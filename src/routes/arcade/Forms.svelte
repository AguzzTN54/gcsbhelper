<script>
	import { badges, pointList, profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { detailPoints, pointCounter } from '$lib/helpers/arcade/calculator';
	import UrlForm from '../_global/URLForm.svelte';

	const process = ({ detail }) => {
		const { user, courses: userBadges, profileID } = detail;
		const detailBadges = detailPoints(userBadges);
		const points = pointCounter(detailBadges);

		profile.set({ name: user, profileID, type: 'arcade' });
		pointList.set(points);
		badges.set(detailBadges);
		accounts.put({ profileID, name: user });
	};
</script>

<UrlForm on:response={process} />
