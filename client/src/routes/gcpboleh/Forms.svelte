<script lang="ts">
	import { lookupBadges } from '$lib/helpers/calculator-juaragcp';
	import { accounts } from '$lib/helpers/localstorage';
	import { juaraBadges, juaraProfile } from '$lib/stores/app-store';
	import UrlForm from '../_global/URLForm.svelte';

	const onResponse = (data: App.ProfileData) => {
		const { user, courses: userBadges } = data;
		const detailBadges = lookupBadges(userBadges);

		juaraProfile.set(user);
		juaraBadges.set(detailBadges as unknown as App.DataScheme[]);
		accounts.put(user, 'juaragcp');
	};
</script>

<UrlForm {onResponse} target="juaragcp" />
