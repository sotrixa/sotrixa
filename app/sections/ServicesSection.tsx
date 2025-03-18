'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function ServicesSection() {
	const [activeService, setActiveService] = useState(0);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const services = ['RESEARCH', 'BRANDING', 'BUSINESS PLANNING', 'BESPOKE STRATEGY', 'MARKETING', 'WEBSITE DEVELOPMENT'];

	// Track scroll position to update active service
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			// Calculate which slide is in view based on scroll position
			const slideWidth = container.clientWidth;
			const scrollPosition = container.scrollLeft;
			const activeIndex = Math.round(scrollPosition / slideWidth);

			if (activeIndex !== activeService) {
				setActiveService(activeIndex);
			}
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [activeService]);

	// Navigate to a specific service
	const scrollToService = (index: number) => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.scrollTo({
			left: index * container.clientWidth,
			behavior: 'smooth',
		});
	};

	return (
		<Section id='services' className='bg-[#FAFAFA] text-black relative overflow-hidden'>
			{/* Service dots navigation */}
			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2'>
				{services.map((_, index) => (
					<button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeService ? 'bg-black scale-150' : 'bg-gray-300'}`} onClick={() => scrollToService(index)} aria-label={`Go to service ${index + 1}`} />
				))}
			</div>

			{/* Horizontal scrolling container */}
			<div
				ref={scrollContainerRef}
				className='flex w-full h-screen overflow-x-auto snap-x snap-mandatory'
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
					WebkitOverflowScrolling: 'touch',
				}}
			>
				{/* Introduction slide */}
				<div className='snap-center flex-shrink-0 w-full h-full'>
					<div className='px-8 md:px-12 lg:px-16 py-20 h-full flex items-center'>
						<div className='relative w-full h-full flex items-center'>
							{/* Main agency description - left side */}
							<motion.div className='absolute left-40 top-1/2 -translate-y-1/2 max-w-2xl text-4xl md:text-6xl font-bold leading-tight' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
								<p className='tracking-tight'>
									A full-service agency
									<br />
									specialising in <span className='text-[#f0d566]'>brand</span>, <span className='text-[#daa1ed]'>audience</span>, and{' '}
									<span className='text-[#7feadb]'>
										creative
										<br />
										research
									</span>
								</p>
							</motion.div>

							{/* Services section heading */}
							<motion.h2 className='absolute right-0 top-20 text-3xl font-medium text-right' initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
								<span className='uppercase font-bold'>YOU NEED IT?</span> we do it.
							</motion.h2>

							{/* Services list preview */}
							<motion.div className='absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end gap-7 text-lg md:text-2xl' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
								{services.map((service, index) => (
									<motion.span key={service} className={`cursor-pointer ${index === activeService ? 'text-black font-serif' : 'text-gray-400'}`} whileHover={{ x: -5 }} onClick={() => scrollToService(index + 1)}>
										{service}
									</motion.span>
								))}
							</motion.div>

							{/* Instruction */}
							<div className='absolute bottom-8 right-8 text-blue-500 text-sm'>Scroll right to explore our services →</div>
						</div>
					</div>
				</div>

				{/* Individual service slides */}
				{services.map((service, index) => (
					<div className='snap-center flex-shrink-0 w-full h-full' key={service}>
						<div className='px-8 md:px-12 lg:px-16 py-20 h-full flex items-center justify-center'>
							<div className='relative w-full h-full flex flex-col items-center justify-center'>
								<motion.h2 className='text-5xl md:text-7xl font-black mb-8' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
									{service}
								</motion.h2>

								<motion.p className='text-xl md:text-2xl text-center max-w-2xl' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
									Our {service.toLowerCase()} service provides comprehensive solutions tailored to your unique business challenges.
								</motion.p>

								{/* Navigation instruction */}
								<div className='absolute bottom-8 right-8 text-sm text-gray-400'>{index < services.length - 1 ? 'Scroll right to next service →' : 'Scroll right to continue →'}</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</Section>
	);
}
