'use client';

import { useRef, useState, useEffect } from 'react';
import Section from '../components/Section';
import { motion } from 'framer-motion';
import { useScrollHandler } from './ServicesSection/hooks/useScrollHandler';
import { useAnimations } from './ServicesSection/hooks/useAnimations';
import Image from 'next/image';
import { gsap } from 'gsap';

export default function ServicesSection() {
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const gifRef = useRef<HTMLDivElement>(null);
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const services = ['RESEARCH', 'BRANDING', 'BUSINESS PLANNING', 'BESOKE STRATEGY', 'MARKETING', 'WEBSITE DEVELOPMENT'];
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
	});

	// Initialize animations
	useAnimations({
		activeServiceIndex,
		serviceItemsRef,
		servicesRef,
		services,
		isAnimating,
	});

	// GSAP Floating Animation for GIF
	useEffect(() => {
		if (!gifRef.current) return;

		// Kill any existing animations
		gsap.killTweensOf(gifRef.current);

		// Random starting position
		const startX = Math.random() * 20 - 10;
		const startY = Math.random() * 20 - 10;

		// Create floating animation
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true,
			ease: 'power1.inOut',
		});

		// Set initial position
		gsap.set(gifRef.current, {
			x: startX,
			y: startY,
			rotate: -5,
		});

		// Floating animation
		tl.to(gifRef.current, {
			x: '+=20',
			y: '-=15',
			rotate: 5,
			duration: 3.5,
		})
			.to(gifRef.current, {
				x: '-=15',
				y: '+=25',
				rotate: -3,
				duration: 4.2,
			})
			.to(gifRef.current, {
				x: '-=10',
				y: '-=10',
				rotate: 2,
				duration: 3.8,
			});

		return () => {
			tl.kill();
		};
	}, [activeServiceIndex]);

	return (
		<Section id='services' className='bg-white text-black p-25 relative overflow-hidden'>
			{/* Floating GIF - positioned bottom right */}
			<div ref={gifRef} className='absolute w-[300px] h-[200px] right-[10%] bottom-[15%] z-10 drop-shadow-2xl transform-gpu' style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.2))' }}>
				<motion.div key={activeServiceIndex} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className='w-full h-full relative'>
					<Image src='/gif/service1.gif' alt={`${services[activeServiceIndex]} visualization`} fill style={{ objectFit: 'cover' }} className='rounded-2xl border-4 border-white' priority />
				</motion.div>
			</div>

			<div className='flex flex-col md:flex-row items-center justify-between gap-12 py-12'>
				{/* Left side with colored text */}
				<motion.div className='md:w-1/2' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
					<div className='text-[42px] leading-tight font-bold max-w-[642px]'>
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
					<div className='mt-8 flex items-center'>
						<div className='text-gray-500 mr-4'>{activeServiceIndex === services.length - 1 && hasCompletedServices.current ? 'Scroll down to continue' : `Viewing service ${activeServiceIndex + 1} of ${services.length}`}</div>

						<div className='flex gap-2'>
							<button onClick={() => handleManualNav('prev')} disabled={activeServiceIndex === 0 && !window.horizontalScrollControls?.prevPanel} className='px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-300 active:bg-gray-400 transition-colors'>
								Prev
							</button>
							<button onClick={() => handleManualNav('next')} className='px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 active:bg-gray-400 transition-colors'>
								Next
							</button>
						</div>
					</div>
				</motion.div>

				{/* Right side with service list - Left-aligned Bold Black Text */}
				<motion.div className='md:w-1/2' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} ref={servicesRef}>
					<div className='flex flex-col items-start text-left space-y-8 p-10'>
						{/* Ultra Bold Black Title */}
						<h2 className='text-3xl font-black uppercase tracking-tight'>OUR SERVICES</h2>

						{/* Services list - direct implementation instead of using components */}
						<div className='w-full space-y-8'>
							{services.map((service, index) => (
								<div
									key={service}
									className={`cursor-pointer transform transition-all duration-300 ${index === activeServiceIndex ? 'text-black font-black text-6xl -translate-y-2' : 'text-gray-500 font-bold text-3xl'}`}
									onClick={() => setActiveServiceIndex(index)}
									ref={(el) => {
										if (el) serviceItemsRef.current[index] = el;
									}}
								>
									<span>{service}</span>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</Section>
	);
}
