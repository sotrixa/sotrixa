'use client';

import { useState, useEffect } from 'react';
import CreatedToMatterSection from '../sections/desktop/CreatedToMatterSection';
import Navigation from '@/app/components/navigation/Navigation';
import dynamic from 'next/dynamic';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/app/lib/seo';

// Use a wrapper component for MobileLayout
const MobileLayout = dynamic(() => import('@/app/components/layout/MobileLayout').then((mod) => ({ default: mod.default })), { ssr: false });

export default function CreatedToMatterPage() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial call
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Generate structured data for this service page
	const serviceSchema = generateServiceSchema({
		name: 'Created To Matter - Strategic Consulting',
		description: 'Empowering bold ideas with strategies that align vision, purpose, and growth. Sotrixa partners with visionary entrepreneurs and changemakers.',
		url: 'https://sotrixa.com/created-to-matter',
	});

	const breadcrumbSchema = generateBreadcrumbSchema([
		{ name: 'Home', url: 'https://sotrixa.com' },
		{ name: 'Created To Matter', url: 'https://sotrixa.com/created-to-matter' },
	]);

	// Mobile layout
	if (isMobile) {
		return (
			<>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(serviceSchema),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(breadcrumbSchema),
					}}
				/>
				<MobileLayout>
					<CreatedToMatterSection />
				</MobileLayout>
			</>
		);
	}

	// Desktop layout
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			<main className='relative bg-[#FAFAFA] min-h-screen'>
				<Navigation />
				<CreatedToMatterSection />
			</main>
		</>
	);
}
