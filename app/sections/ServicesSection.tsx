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
	const sectionContainerRef = useRef<HTMLDivElement>(null);
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const services = ['RESEARCH', 'BRANDING', 'BUSINESS PLANNING', 'BESOKE STRATEGY', 'MARKETING', 'WEBSITE DEVELOPMENT'];
	const sectionIndex = 2; // Position of services section in the page layout
	const hasCompletedServices = useRef(false);
	const isAnimating = useRef(false);

	// Use custom hooks for scroll handling and animations
	useScrollHandler({
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

	// Get random position within boundaries
	const getRandomPosition = () => {
		// Ensure values stay within the screen boundaries (with padding)
		const maxX = 80; // Max percentage of screen width
		const maxY = 70; // Max percentage of screen height
		const minX = 10; // Min percentage from left
		const minY = 10; // Min percentage from top

		return {
			x: Math.floor(Math.random() * (maxX - minX) + minX),
			y: Math.floor(Math.random() * (maxY - minY) + minY),
		};
	};

	// GSAP Floating Animation for GIF
	useEffect(() => {
		if (!gifRef.current || !sectionContainerRef.current) return;

		// Kill any existing animations
		gsap.killTweensOf(gifRef.current);

		// Get random initial position
		const initialPos = getRandomPosition();

		// Create floating animation
		const tl = gsap.timeline({
			repeat: -1,
			repeatRefresh: true, // Get fresh random values on each repeat
			onRepeat: () => {
				// Change GIF positions more dramatically on each loop
				const newPos = getRandomPosition();
				gsap.to(gifRef.current, {
					left: `${newPos.x}%`,
					top: `${newPos.y}%`,
					duration: 8,
					ease: 'power1.inOut',
				});
			},
		});

		// Set initial position
		gsap.set(gifRef.current, {
			left: `${initialPos.x}%`,
			top: `${initialPos.y}%`,
			xPercent: -50, // Center the element horizontally
			yPercent: -50, // Center the element vertically
			rotate: Math.random() * 10 - 5,
		});

		// Floating animation
		tl.to(gifRef.current, {
			x: '+=50',
			y: '-=30',
			rotate: Math.random() * 10 - 5,
			duration: 5 + Math.random() * 2,
			ease: 'sine.inOut',
		})
			.to(gifRef.current, {
				x: '-=70',
				y: '+=60',
				rotate: Math.random() * 10 - 5,
				duration: 6 + Math.random() * 2,
				ease: 'sine.inOut',
			})
			.to(gifRef.current, {
				x: '+=20',
				y: '-=30',
				rotate: Math.random() * 10 - 5,
				duration: 4 + Math.random() * 2,
				ease: 'sine.inOut',
			});

		return () => {
			tl.kill();
		};
	}, [activeServiceIndex]);

	return (
		<Section id='services' className='bg-white text-black p-25 relative overflow-hidden'>
			{/* Container div with ref */}
			<div ref={sectionContainerRef} className='relative w-full h-full'>
				{/* Floating GIF - positioned randomly */}
				<div ref={gifRef} className='absolute w-[300px] h-[200px] z-10 drop-shadow-2xl transform-gpu pointer-events-none' style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.2))' }}>
					<motion.div key={activeServiceIndex} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className='w-full h-full relative'>
						<Image src={`/gif/service${activeServiceIndex + 1}.gif`} alt={`${services[activeServiceIndex]} visualization`} fill style={{ objectFit: 'cover' }} className='rounded-2xl border-4 border-white' priority />
					</motion.div>
				</div>

				<div className='flex flex-col md:flex-row items-center justify-between gap-12 py-12'>
					{/* Left side with colored text */}
					<motion.div className='md:w-full' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
						<div className='text-[62px] leading-tight font-bold max-w-[642px]'>
							<span className='text-black'>A full-service agency </span>
							<br />
							<span className='text-black'>specialising in </span>
							<span className='text-[#f4dd65]'>brand</span>
							<span className='text-black'>, </span>
							<br />
							<span className='text-[#d142e2]'>audience</span>
							<span className='text-black'>, and </span>
							<span className='text-[#70DFC6]'>creative </span>

							<span className='text-[#70DFC6]'>research</span>
						</div>
					</motion.div>

					{/* Right side with service list - Left-aligned Bold Black Text */}
					<motion.div className='md:w-full' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} ref={servicesRef}>
						<div className='flex flex-col items-start text-left space-y-8 p-10 ml-10'>
							{/* Cool gradient title with slogan */}
							<div className='space-y-2'>
								<h2 className='text-4xl font-black tracking-tight relative overflow-hidden'>
									<span className='bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text animate-pulse'>You need it - we do it!</span>
								</h2>
								<div className='h-1 w-full bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full'></div>
							</div>

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
			</div>
		</Section>
	);
}
