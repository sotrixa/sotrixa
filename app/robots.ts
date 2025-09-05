import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',
					'/admin/',
					'/_next/',
					'/private/',
					'/*.json$',
					'/temp/',
				],
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: [
					'/api/',
					'/admin/',
					'/_next/',
					'/private/',
				],
			},
			{
				userAgent: 'Bingbot',
				allow: '/',
				disallow: [
					'/api/',
					'/admin/',
					'/_next/',
					'/private/',
				],
			},
		],
		sitemap: 'https://sotrixa.com/sitemap.xml',
		host: 'https://sotrixa.com',
	};
}
