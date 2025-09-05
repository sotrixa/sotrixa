import type { Metadata } from 'next';
import { generateMetadata } from '@/app/lib/seo';

export const metadata: Metadata = generateMetadata({
	title: 'Created To Matter - Strategic Consulting',
	description: 'Empowering bold ideas with strategies that align vision, purpose, and growth. Sotrixa partners with visionary entrepreneurs, creatives, and changemakers building with purpose.',
	url: '/created-to-matter',
	keywords: [
		'strategic consulting',
		'business strategy',
		'visionary entrepreneurs',
		'creative strategy',
		'purpose-driven business',
		'strategic planning',
		'business development',
		'startup strategy',
		'creative consultancy',
		'strategic direction',
	],
});

export default function CreatedToMatterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}