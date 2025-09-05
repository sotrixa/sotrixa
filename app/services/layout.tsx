import type { Metadata } from 'next';
import { generateMetadata } from '@/app/lib/seo';

export const metadata: Metadata = generateMetadata({
	title: 'Services - Strategic Design Solutions',
	description: 'Explore our comprehensive strategic design services: Research, Branding, Marketing, and Website Development. We shape strategic direction that moves ideas forward.',
	url: '/services',
	keywords: [
		'strategic design services',
		'brand strategy',
		'creative research',
		'marketing strategy',
		'website development',
		'design consulting',
		'strategic planning',
		'brand development',
		'digital strategy',
		'creative solutions',
	],
});

export default function ServicesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
