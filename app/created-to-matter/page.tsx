'use client';

import { useState, useEffect } from 'react';
import CreatedToMatterSection from '../sections/CreatedToMatterSection';
import Navigation from '@/app/components/Navigation';
import dynamic from 'next/dynamic';

// Use a wrapper component for MobileLayout
const MobileLayout = dynamic(() => import('@/app/components/MobileLayout').then((mod) => ({ default: mod.default })), { ssr: false });

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

	// Mobile layout
	if (isMobile) {
		return (
			<MobileLayout>
				<CreatedToMatterSection />
			</MobileLayout>
		);
	}

	// Desktop layout
	return (
		<main className='relative bg-[#FAFAFA] min-h-screen'>
			<Navigation />
			<CreatedToMatterSection />
		</main>
	);
}
