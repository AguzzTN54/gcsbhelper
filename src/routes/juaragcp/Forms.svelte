<script>
	import { lookupBadges } from '$lib/helpers/calculator-juaragcp';
	import { accounts } from '$lib/helpers/localstorage';
	import { juaraBadges, juaraProfile } from '$lib/stores/app-store';
	import UrlForm from '../_global/URLForm.svelte';

	const process = ({ detail }) => {
		const { user, courses: userBadges, profileID } = detail;
		const detailBadges = lookupBadges(userBadges);

		juaraProfile.set({ name: user, profileID });
		juaraBadges.set(detailBadges);
		accounts.put({ profileID, name: user }, 'juaragcp');
	};
</script>

<UrlForm on:response={process} target="juaragcp" />
