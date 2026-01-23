'use client';

import { useRef, useState } from 'react';
import Section from '../../../components/layout/Section';
import { motion } from 'framer-motion';
import { useScrollHandler } from './hooks/useScrollHandler';
import { useAnimations } from './hooks/useAnimations';
import { ServicesList } from './components/ServicesList';
import { ProgressIndicator } from './components/ProgressIndicator';
import { SectionTitle } from './components/SectionTitle';

export default function ServicesSection() {
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const [isDetailView, setIsDetailView] = useState(false);
	const services = ['RESEARCH', 'BRAND STORYTELLING', 'BUSINESS PLANNING', 'BESOKE STRATEGY', 'MARKETING', 'WEBSITE DEVELOPMENT'];
	const sectionIndex = 2; // Position of services section in the page layout
	const hasCompletedServices = useRef(false);
	const isAnimating = useRef(false);

	// Use custom hooks for scroll handling and animations
	const { handleManualNav } = useScrollHandler({
		activeServiceIndex,
		setActiveServiceIndex,
		services,
		sectionIndex,
		isAnimating,
		hasCompletedServices,
		isDetailView,
	});

	// Initialize animations
	useAnimations({
		activeServiceIndex,
		serviceItemsRef,
		servicesRef,
		services,
		isAnimating,
	});

	return (
		<Section id='services' className='bg-white text-black px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 py-8 sm:py-10 md:py-12'>
				{/* Left side with colored text */}
				<motion.div className='lg:w-1/2 w-full' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
					<div className='leading-tight font-bold max-w-full lg:max-w-[642px]' style={{ fontSize: 'clamp(1rem, 5.5vw, 4rem)' }}>
						<span className='text-black'>A full-service agency </span>
						<br />
						<span className='text-black'>specialising in </span>
						<span className='text-[#f4dd65]'>brand</span>
						<span className='text-black'>, </span>
						<br />
						<span className='text-[#d142e2]'>audience</span>
						<span className='text-black'>, and </span>
						<span className='text-[#70DFC6]'>creative </span>
						<br />
						<span className='text-[#70DFC6]'>research</span>
					</div>

					{/* Navigation buttons */}
					<div className='mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0'>
						<div className='text-gray-500 text-sm sm:text-base sm:mr-4'>{activeServiceIndex === services.length - 1 && hasCompletedServices.current ? 'Scroll down to continue' : `Viewing service ${activeServiceIndex + 1} of ${services.length}`}</div>

						<div className='flex gap-2'>
							<button onClick={() => handleManualNav('prev')} disabled={activeServiceIndex === 0 && !window.horizontalScrollControls?.prevPanel} className='px-3 py-1.5 sm:py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-300 active:bg-gray-400 transition-colors'>
								Prev
							</button>
							<button onClick={() => handleManualNav('next')} className='px-3 py-1.5 sm:py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 active:bg-gray-400 transition-colors'>
								Next
							</button>
						</div>
					</div>
				</motion.div>

				{/* Right side with service list - Enhanced with modern design */}
				<motion.div className='lg:w-1/2 w-full' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} ref={servicesRef}>
					<div className='relative flex flex-col items-center lg:items-end text-center lg:text-right space-y-2 sm:space-y-3 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100'>
						{/* Cool background decorative elements */}
						<div className='absolute top-0 right-0 w-32 h-32 bg-[#f4dd65] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl'></div>
						<div className='absolute bottom-0 left-0 w-40 h-40 bg-[#d142e2] opacity-10 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl'></div>

						{/* Heading with gradient */}
						<SectionTitle text='You name it - we do it!' />

						{/* Progress indicator */}
						<ProgressIndicator activeIndex={activeServiceIndex} totalItems={services.length} />

						{/* Services list */}
						<ServicesList services={services} activeServiceIndex={activeServiceIndex} setActiveServiceIndex={setActiveServiceIndex} serviceItemsRef={serviceItemsRef} isDetailView={isDetailView} setIsDetailView={setIsDetailView} />
					</div>
				</motion.div>
			</div>
		</Section>
	);
}
