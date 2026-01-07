import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { MetaTagsProps } from 'svelte-meta-tags';
import { isValidUUID } from '$lib/helpers/uuid';
import { localAccounts } from '$lib/helpers/localstorage';

export const load = async ({ url }) => {
	const image = url.origin + '/images/arcade.jpg';
	const pageMetaTags: Partial<MetaTagsProps> = {
		title: 'Arcade Progress Tracker 2026 - Cohort 1',
		keywords: [
			'Arcade Calculator',
			'Arcadecalc',
			'Google Arcade',
			'Arcade Progress Tracker',
			'GCP Game',
			'GCP',
			'Qwiklabs',
			'Google Cloud',
			'Google Free Gift',
			'Google Free Swags',
			'Google Events',
			'GCP Events',
			'GCP Gift',
			'GCP Swags',
			'GCP Free Trial',
			'Google Developer Events',
			'Global Google Games'
		],
		twitter: { image },
		openGraph: {
			title: 'Arcade Progress Tracker 2026 - Cohort 1',
			images: [{ url: image, secureUrl: image }]
		}
	};

	if (url.pathname !== '/arcade' || !browser) return { pageMetaTags };

	const newForm = url.searchParams.get('new');
	const isNew = typeof newForm === 'string';
	if (isNew) return { pageMetaTags }; // Load Form to submit new acoount

	const { uuid } = localAccounts.getActive() || {};
	const isvalidId = isValidUUID(uuid || '');
	if (!isvalidId) return { pageMetaTags };

	// Redirect to dashboard if has valid profileid
	goto('/arcade/dash');
};
