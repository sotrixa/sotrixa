import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Sotrixa - Strategic Design Agency',
		short_name: 'Sotrixa',
		description: 'We are a strategy lab for visionary thinkers. Through deep analysis and creative design, we shape strategic direction that moves ideas forward.',
		start_url: '/',
		display: 'standalone',
		background_color: '#000000',
		theme_color: '#000000',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
			{
				src: '/sotrixa-logo.webp',
				sizes: '192x192',
				type: 'image/webp',
			},
			{
				src: '/sotrixa-logo.webp',
				sizes: '512x512',
				type: 'image/webp',
			},
		],
		categories: ['business', 'design', 'marketing', 'consulting'],
		lang: 'en-US',
	};
}
