<script>
	import { arcadeBadges, pointList, arcadeProfile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { detailPoints, pointCounter } from '$lib/helpers/arcade/calculator';
	import UrlForm from '../_global/URLForm.svelte';

	const proccessOfficial = (data) => {
		const { full_name, email, ref_code, last_update, profileID } = data;
		const { trivia, skillbadge, arcade } = data;
		const dt = { type: 'arcade', isOfficial: true };

		const { name: currentName, profileID: currentID } = $arcadeProfile;
		const name = currentID === profileID && currentName ? currentName : full_name;
		arcadeProfile.set({ name, profileID, email, last_update, ref_code, ...dt });

		if (!(name && profileID)) return;
		pointList.set({ trivia, skillbadge, arcade });
		accounts.put({ profileID, name });
	};

	const process = ({ detail }) => {
		if (detail.official) return proccessOfficial(detail);

		const { user, courses: userBadges, profileID } = detail;
		const detailBadges = detailPoints(userBadges);
		const points = pointCounter(detailBadges);
		console.log(points);

		arcadeProfile.set({ name: user, profileID });
		pointList.set(points);
		arcadeBadges.set(detailBadges);
		accounts.put({ profileID, name: user });
	};
</script>

<UrlForm on:response={process} />
