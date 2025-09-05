import type { Metadata } from 'next';

// Base SEO configuration
export const siteConfig = {
	name: 'Sotrixa',
	title: 'Sotrixa - Strategic Design Agency for Visionary Thinkers',
	description: 'We are a strategy lab for visionary thinkers. Through deep analysis and creative design, we shape strategic direction that moves ideas forward. Specializing in research, branding, marketing, and website development.',
	url: 'https://sotrixa.com',
	siteName: 'Sotrixa',
	creator: 'Sotrixa Team',
	keywords: [
		'strategic design agency',
		'brand strategy',
		'creative research',
		'marketing strategy',
		'website development',
		'brand identity',
		'visual identity',
		'business strategy',
		'digital strategy',
		'creative consultancy',
		'design thinking',
		'brand development',
		'strategic planning',
		'creative direction',
		'user experience design',
		'brand positioning',
		'marketing campaigns',
		'digital transformation',
		'creative solutions',
		'strategic consulting'
	],
	authors: [
		{
			name: 'Sotrixa Team',
			url: 'https://sotrixa.com',
		},
	],
	locale: 'en_US',
	alternateLocales: ['bg_BG'],
};

// Generate metadata for different page types
export function generateMetadata({
	title,
	description,
	image,
	url,
	type = 'website',
	keywords,
}: {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: 'website' | 'article';
	keywords?: string[];
}): Metadata {
	const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
	const metaDescription = description || siteConfig.description;
	const metaImage = image || `${siteConfig.url}/sotrixa-logo.webp`;
	const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
	const metaKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: metaKeywords.join(', '),
		authors: siteConfig.authors,
		creator: siteConfig.creator,
		openGraph: {
			type,
			locale: siteConfig.locale,
			url: metaUrl,
			title: metaTitle,
			description: metaDescription,
			siteName: siteConfig.siteName,
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: metaTitle,
			description: metaDescription,
			images: [metaImage],
			creator: '@sotrixa',
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: metaUrl,
			languages: {
				'en-US': metaUrl,
				'bg-BG': `${metaUrl}/bg`,
			},
		},
	};
}

// Structured data generators
export function generateOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Sotrixa',
		description: siteConfig.description,
		url: siteConfig.url,
		logo: `${siteConfig.url}/sotrixa-logo.webp`,
		foundingDate: '2020',
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			availableLanguage: ['English', 'Bulgarian'],
		},
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'BG',
		},
		sameAs: [
			'https://linkedin.com/company/sotrixa',
		],
		serviceArea: {
			'@type': 'Place',
			name: 'Worldwide',
		},
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Strategic Design Services',
			itemListElement: [
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Strategic Research',
						description: 'Deep research and analysis to uncover insights that inform strategic direction.',
					},
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Brand Strategy & Identity',
						description: 'Visual and verbal brand identities that feel alive and true to your business story.',
					},
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Marketing Strategy',
						description: 'Soulful marketing strategies that resonate and move your audience.',
					},
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Website Development',
						description: 'Websites where form meets feeling, and strategy becomes tangible experience.',
					},
				},
			],
		},
	};
}

export function generateWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		potentialAction: {
			'@type': 'SearchAction',
			target: `${siteConfig.url}/search?q={search_term_string}`,
			'query-input': 'required name=search_term_string',
		},
		publisher: {
			'@type': 'Organization',
			name: 'Sotrixa',
			logo: {
				'@type': 'ImageObject',
				url: `${siteConfig.url}/sotrixa-logo.webp`,
			},
		},
	};
}

export function generateServiceSchema(service: {
	name: string;
	description: string;
	url: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.name,
		description: service.description,
		provider: {
			'@type': 'Organization',
			name: 'Sotrixa',
			url: siteConfig.url,
		},
		url: service.url,
		serviceType: 'Strategic Design',
		areaServed: 'Worldwide',
	};
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
