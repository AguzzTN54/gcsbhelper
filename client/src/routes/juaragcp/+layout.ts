import type { MetaTagsProps } from 'svelte-meta-tags';

export const load = ({ url }) => {
	const image = url.origin + '/images/juaragcp.jpg';
	const pageMetaTags: Partial<MetaTagsProps> = {
		title: 'Juara GCP S12 Progress Tracker - 2025',
		keywords: [
			'Juara GCP',
			'Google Event Indonesia',
			'GCP Free Tier',
			'GCP Gift',
			'GCP Swags',
			'GCP Free Trial',
			'Google Developer Events',
			'Global Google Games',
			'Qwiklabs'
		],
		twitter: { image },
		openGraph: { images: [{ url: image, secureUrl: image }] }
	};
	return { pageMetaTags };
};
