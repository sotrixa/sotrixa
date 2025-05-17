'use client';

import { useState, useEffect } from 'react';
import GsapHorizontalScroll from '@/app/components/GsapHorizontalScroll';
import KeyboardControls from '@/app/components/KeyboardControls';
import HomeSection from '@/app/sections/HomeSection';
import IntroSection from '@/app/sections/IntroSection';
import ServicesSection from '@/app/sections/ServicesSection';
import ScrollPathPagination from '@/app/components/ScrollPathPagination';
import CaseStudySection from '@/app/sections/CaseStudySection';
import ContactSection from '@/app/sections/ContactSection';
import Navigation from '@/app/components/Navigation';
import dynamic from 'next/dynamic';

// Use a wrapper component for MobileLayout
const MobileLayout = dynamic(() => import('@/app/components/MobileLayout').then((mod) => ({ default: mod.default })), { ssr: false });

// Dynamic imports for mobile components
const MobileHomeSection = dynamic(() => import('@/app/sections/mobile/MobileHomeSection').then((mod) => ({ default: mod.default })), { ssr: false });
const MobileIntroSection = dynamic(() => import('@/app/sections/mobile/MobileIntroSection').then((mod) => ({ default: mod.default })), { ssr: false });
const MobileServicesSection = dynamic(() => import('@/app/sections/mobile/MobileServicesSection').then((mod) => ({ default: mod.default })), { ssr: false });
const MobileCaseStudySection = dynamic(() => import('@/app/sections/mobile/MobileCaseStudySection').then((mod) => ({ default: mod.default })), { ssr: false });
const MobileContactSection = dynamic(() => import('@/app/sections/mobile/MobileContactSection').then((mod) => ({ default: mod.default })), { ssr: false });

export default function Home() {
	// Sections for the pagination
	const sections = ['Home', 'Intro', 'Services', 'Case Study', 'Contact'];
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

	// Render mobile layout when on smaller screens
	if (isMobile) {
		return (
			<MobileLayout>
				<MobileHomeSection />
				<MobileIntroSection />
				<MobileServicesSection />
				<MobileCaseStudySection />
				<MobileContactSection />
			</MobileLayout>
		);
	}

	// Desktop horizontal scroll layout
	return (
		<>
			{/* Direct inclusion of pagination with the new design */}
			<ScrollPathPagination sections={sections} activeSection={0} />

			<main className='relative bg-black min-h-screen'>
				<KeyboardControls />
				<Navigation />

				<GsapHorizontalScroll>
					<HomeSection />
					<IntroSection />
					<ServicesSection />
					<CaseStudySection />
					<ContactSection />
				</GsapHorizontalScroll>
			</main>
		</>
	);
}
