import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://sotrixa.com';
	const lastModified = new Date();

	return [
		{
			url: baseUrl,
			lastModified,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/created-to-matter`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		// Service pages (based on the services offered)
		{
			url: `${baseUrl}/services/research`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/services/branding`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/services/marketing`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/services/website-development`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		// Case studies
		{
			url: `${baseUrl}/case-studies`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/case-studies/brand-strategy`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/case-studies/marketing-strategy`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/case-studies/business-strategy`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		// Contact
		{
			url: `${baseUrl}/contact`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		// About
		{
			url: `${baseUrl}/about`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		// Bulgarian language versions
		{
			url: `${baseUrl}/bg`,
			lastModified,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/bg/created-to-matter`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/bg/services/research`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/bg/services/branding`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/bg/services/marketing`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/bg/services/website-development`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	];
}
