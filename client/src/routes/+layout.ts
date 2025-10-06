import type { MetaTagsProps } from 'svelte-meta-tags';

export const prerender = true;

export const load = ({ url }) => {
	const image = url.origin + '/images/default.jpg';
	const baseMetaTags: MetaTagsProps = Object.freeze({
		title: 'Google Cloud Skills Boost Helper Tools',
		titleTemplate: '%s',
		description: `Analyze your Google Cloud Skills Boost profile and find out what you can improve.`,
		keywords: [
			'Google Cloud Skills Boost',
			'GCP',
			'Qwiklabs',
			'Google Cloud',
			'Google Developer Events',
			'Global Google Games',
			'Arcade',
			'JuaraGCP',
			'GCP Boleh',
			'Arcade Calculator',
			'JuaraGCP Tracker'
		],
		canonical: new URL(url.pathname, url.origin).href,
		twitter: { image },
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
			locale: 'en_US',
			title: 'Google Cloud Skills Boost Helper Tools',
			description: `Analyze your Google Cloud Skills Boost profile and find out what you can improve.`,
			siteName: 'GCSB Helper',
			images: [
				{
					url: image,
					alt: 'Google Cloud Skills Boost Helper',
					width: 1280,
					height: 720,
					secureUrl: image,
					type: 'image/jpeg'
				}
			]
		}
	});

	return { baseMetaTags };
};
