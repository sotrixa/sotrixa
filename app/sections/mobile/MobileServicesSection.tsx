'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ServiceInfoSection from '../../sections/ServiceInfoSection';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

function MobileServicesSectionComponent() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const servicesRef = useRef<HTMLDivElement>(null);
	const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const gifRef = useRef<HTMLDivElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);
	const [isDetailView, setIsDetailView] = useState(false);
	const [showServiceInfo, setShowServiceInfo] = useState(false);
	const isScrolling = useRef(false);

	// Store navigation history to ensure correct back flow
	const navigationHistory = useRef<{
		fromListToDetail: boolean;
		fromDetailToInfo: boolean;
	}>({
		fromListToDetail: false,
		fromDetailToInfo: false,
	});

	// Services data - matches desktop version
	const services = ['CREATED TO MATTER', 'RESEARCH', 'BUSINESS ARCHITECTURE', 'BESPOKE STRATEGY CREATION', 'BRANDING', 'MARKETING', 'WEBSITE DEVELOPMENT'];

	// Service descriptions - matches desktop version
	const serviceDescriptions = ['Empowering bold ideas with strategies that align vision, purpose, and growth.', 'Deep research, nuanced insight, and future-facing signals that shape powerful strategies.', 'Turning vision into a structured, evolving business - ready for real-world growth.', 'Precision-crafted roadmaps that move your vision forward with clarity, coherence, and purpose.', 'Bringing your business true story to life - visually, verbally, and emotionally.', 'Expanding your presence with soulful marketing strategies that resonate and move.', 'Crafting websites where form meets feeling, and strategy becomes tangible experience.'];

	// Set up refs for service items
	useEffect(() => {
		serviceItemsRef.current = serviceItemsRef.current.slice(0, services.length);
	}, [services.length]);

	// Function to animate detail view entrance when returning from service info
	const animateDetailViewEntrance = useCallback(() => {
		if (!isDetailView) return;

		// Get the detail view container
		const detailViewContainer = document.querySelector('.detail-view-container');
		if (!detailViewContainer) return;

		// Create entrance animation
		gsap.fromTo(
			detailViewContainer,
			{
				opacity: 0.8,
				y: 10,
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: 'power2.out',
			}
		);
	}, [isDetailView]);

	// Track state changes between service info and detail view
	useEffect(() => {
		// When returning from service info, ensure detail view is visible if we came from detail view
		if (!showServiceInfo && isDetailView && navigationHistory.current.fromDetailToInfo) {
			// This means we just returned from service info to detail view
			// Apply entrance animation with slight delay to ensure DOM is ready
			setTimeout(() => {
				animateDetailViewEntrance();
			}, 50);
		}

		// When returning to list view from detail view
		if (!isDetailView && navigationHistory.current.fromListToDetail) {
			// Reset navigation path
			navigationHistory.current.fromListToDetail = false;
		}
	}, [showServiceInfo, isDetailView, animateDetailViewEntrance]);

	// Effect to handle scrolling prevention
	useEffect(() => {
		// Get body element
		const body = document.body;

		// Prevent scrolling when showing service info or in detail view
		if (showServiceInfo || isDetailView) {
			// Save current scroll position
			const scrollY = window.scrollY;

			// Add no-scroll class and inline styles
			body.style.position = 'fixed';
			body.style.top = `-${scrollY}px`;
			body.style.width = '100%';
			body.style.overflowY = 'hidden';
		} else {
			// Re-enable scrolling when returning to main view
			const scrollY = body.style.top;
			body.style.position = '';
			body.style.top = '';
			body.style.width = '';
			body.style.overflowY = '';

			// Restore scroll position
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
			}
		}

		// Cleanup function
		return () => {
			body.style.position = '';
			body.style.top = '';
			body.style.width = '';
			body.style.overflowY = '';
		};
	}, [showServiceInfo, isDetailView, animateDetailViewEntrance]);

	// Debounced service index setter to prevent rapid changes
	const debouncedSetActiveServiceIndex = useCallback((value: React.SetStateAction<number>) => {
		if (isScrolling.current) return;

		isScrolling.current = true;
		setActiveServiceIndex(value);

		// Reset scrolling flag after animation completes
		setTimeout(() => {
			isScrolling.current = false;
		}, 500);
	}, []);

	// Get random position within boundaries
	const getRandomPosition = () => {
		const maxX = 70;
		const maxY = 60;
		const minX = 20;
		const minY = 20;

		return {
			x: Math.floor(Math.random() * (maxX - minX) + minX),
			y: Math.floor(Math.random() * (maxY - minY) + minY),
		};
	};

	// GSAP Floating Animation for GIF
	useEffect(() => {
		if (!gifRef.current || isDetailView) return;

		// Kill any existing animations
		gsap.killTweensOf(gifRef.current);

		// Get random initial position
		const initialPos = getRandomPosition();

		// Create floating animation
		const tl = gsap.timeline({
			repeat: -1,
			repeatRefresh: true,
			onRepeat: () => {
				// Change GIF positions on each loop
				const newPos = getRandomPosition();
				gsap.to(gifRef.current, {
					left: `${newPos.x}%`,
					top: `${newPos.y}%`,
					duration: 6,
					ease: 'power1.inOut',
				});
			},
		});

		// Set initial position
		gsap.set(gifRef.current, {
			left: `${initialPos.x}%`,
			top: `${initialPos.y}%`,
			xPercent: -50,
			yPercent: -50,
			rotate: Math.random() * 8 - 4,
		});

		// Floating animation
		tl.to(gifRef.current, {
			x: '+=30',
			y: '-=20',
			rotate: Math.random() * 8 - 4,
			duration: 4 + Math.random() * 2,
			ease: 'sine.inOut',
		})
			.to(gifRef.current, {
				x: '-=40',
				y: '+=30',
				rotate: Math.random() * 8 - 4,
				duration: 5 + Math.random() * 2,
				ease: 'sine.inOut',
			})
			.to(gifRef.current, {
				x: '+=10',
				y: '-=10',
				rotate: Math.random() * 8 - 4,
				duration: 3 + Math.random() * 2,
				ease: 'sine.inOut',
			});

		return () => {
			tl.kill();
		};
	}, [activeServiceIndex, isDetailView]);

	// Animate the background grid
	useEffect(() => {
		if (!backgroundRef.current) return;

		gsap.fromTo(
			backgroundRef.current,
			{
				opacity: 0,
				scale: 0.95,
			},
			{
				opacity: 0.4,
				scale: 1,
				duration: 1.2,
				ease: 'power2.out',
			}
		);

		// Subtle continuous movement
		gsap.to(backgroundRef.current, {
			backgroundPosition: '100% 100%',
			duration: 90,
			ease: 'none',
			repeat: -1,
		});
	}, []);

	// Main service list animations
	useEffect(() => {
		if (!servicesRef.current) return;

		// Staggered animation for service items
		serviceItemsRef.current.forEach((item, index) => {
			if (!item) return;

			gsap.fromTo(
				item,
				{
					opacity: 0,
					y: 20,
				},
				{
					opacity: 1,
					y: 0,
					duration: 0.4,
					delay: 0.1 + index * 0.08,
					scrollTrigger: {
						trigger: item,
						start: 'top 85%',
						toggleActions: 'play none none reverse',
					},
				}
			);
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
		};
	}, [isDetailView]);

	// Handle service selection
	const handleServiceClick = (index: number) => {
		debouncedSetActiveServiceIndex(index);

		// Set navigation history
		navigationHistory.current.fromListToDetail = true;
		navigationHistory.current.fromDetailToInfo = false;

		// Smooth transition without flash
		const tl = gsap.timeline();
		tl.to(gifRef.current, {
			opacity: 0,
			scale: 0.8,
			duration: 0.3,
			ease: 'power1.out',
			onComplete: () => {
				setIsDetailView(true);
			},
		});
	};

	// Handle back button click
	const handleBackClick = () => {
		// Reset navigation history
		navigationHistory.current.fromListToDetail = false;
		navigationHistory.current.fromDetailToInfo = false;

		setIsDetailView(false);

		// Restore GIF animation after switching back to list view
		if (gifRef.current) {
			gsap.to(gifRef.current, {
				opacity: 1,
				scale: 1,
				duration: 0.5,
				ease: 'power2.out',
			});
		}
	};

	// Handle service info link click
	const handleServiceInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();

		// Set navigation history
		navigationHistory.current.fromDetailToInfo = true;

		// Create smooth transition
		const tl = gsap.timeline({
			onComplete: () => {
				setShowServiceInfo(true);
			},
		});

		// Fade out the current view before showing service info
		tl.to('.detail-view-container', {
			opacity: 0.8,
			y: -10,
			duration: 0.3,
			ease: 'power2.inOut',
		});
	};

	// Handle back from service info
	const handleBackFromServiceInfo = () => {
		// Create animation sequence for smooth transition back
		const tl = gsap.timeline();

		// Fade out animation before returning to services
		tl.to('.service-info-container', {
			opacity: 0.8,
			scale: 0.98,
			duration: 0.4,
			ease: 'power2.inOut',
			onComplete: () => {
				// Check navigation history to determine where to go back
				if (navigationHistory.current.fromDetailToInfo) {
					// Return to detail view
					setShowServiceInfo(false);
					setIsDetailView(true);

					// Reset this part of navigation history
					navigationHistory.current.fromDetailToInfo = false;

					// Ensure we're animating the detail view entrance after state update
					setTimeout(() => {
						animateDetailViewEntrance();
					}, 50);
				} else {
					// If we somehow got here directly, go back to list view
					setShowServiceInfo(false);
					setIsDetailView(false);

					// Reset navigation history completely
					navigationHistory.current.fromListToDetail = false;
					navigationHistory.current.fromDetailToInfo = false;
				}
			},
		});

		return tl;
	};

	// Reset scroll position on view changes
	useEffect(() => {
		// Reset scroll position when changing views
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
		}
	}, [isDetailView, showServiceInfo]);

	return (
		<>
			{showServiceInfo ? (
				<div className='fixed inset-0 z-50 w-full h-full bg-[#FAFAFA] overflow-auto service-info-container'>
					<ServiceInfoSection onBackClick={handleBackFromServiceInfo} activeService={services[activeServiceIndex]} />
				</div>
			) : (
				<section ref={sectionRef} id='mobile-services' className='relative min-h-screen py-10 overflow-hidden bg-[#FAFAFA] text-black'>
					{/* Minimalist grid background */}
					<div
						ref={backgroundRef}
						className='absolute inset-0 z-0'
						style={{
							backgroundImage: `
								linear-gradient(to right, rgba(150,150,150,0.12) 1px, transparent 1px),
								linear-gradient(to bottom, rgba(150,150,150,0.12) 1px, transparent 1px)
							`,
							backgroundSize: '30px 30px',
							backgroundPosition: '0 0',
						}}
					>
						{/* Decorative elements */}
						<div className='absolute top-[15%] left-[10%] w-[60px] h-[60px] border-2 border-gray-300 rounded-full opacity-20 transform rotate-45'></div>
						<div className='absolute bottom-[20%] right-[5%] w-[80px] h-[80px] border-2 border-gray-300 rounded-full opacity-20 transform -rotate-12'></div>

						{/* Abstract lines */}
						<div className='absolute top-[25%] left-0 w-[20%] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30'></div>
						<div className='absolute bottom-[35%] right-0 w-[25%] h-[1px] bg-gradient-to-l from-transparent via-gray-400 to-transparent opacity-30'></div>

						{/* Dots grid in corner */}
						<div
							className='absolute top-0 right-0 w-[120px] h-[120px] opacity-15'
							style={{
								backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.6) 1.5px, transparent 1.5px)',
								backgroundSize: '15px 15px',
							}}
						></div>
					</div>

					<div className='relative container mx-auto px-4 z-10'>
						{/* Floating GIF - positioned randomly and hidden in detail view */}
						<div
							ref={gifRef}
							className='absolute w-[150px] h-[100px] z-10 drop-shadow-xl transform-gpu pointer-events-none'
							style={{
								filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))',
								visibility: isDetailView ? 'hidden' : 'visible',
							}}
						>
							<motion.div key={activeServiceIndex} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className='w-full h-full relative'>
								<Image src={`/gif/service${activeServiceIndex + 1}.gif`} alt={`${services[activeServiceIndex]} visualization`} fill style={{ objectFit: 'cover' }} className='rounded-lg border-2 border-white' priority />
							</motion.div>
						</div>

						<AnimatePresence mode='wait'>
							{!isDetailView ? (
								/* Services List View */
								<motion.div key='services-list' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className='pt-6'>
									<div className='mb-8'>
										<div className='text-2xl sm:text-3xl font-bold max-w-[90%] mb-6'>
											<span>Strategic Services</span>
											<span className='bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text'> For Your Business</span>
										</div>
										<p className='text-base text-gray-600 mb-8'>Tailored solutions that align with your vision and drive growth.</p>
									</div>

									{/* Cool gradient title with slogan */}
									<div className='space-y-2 w-full mb-6'>
										<h2 className='text-xl font-bold tracking-tight relative overflow-hidden'>
											<span className='bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text animate-pulse'>You need it - we do it!</span>
										</h2>
										<div className='h-1 w-full bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full'></div>
									</div>

									{/* Services list */}
									<div ref={servicesRef} className='space-y-4 mt-6'>
										{services.map((service, index) => (
											<div
												key={service}
												className={`cursor-pointer transform transition-all duration-300 ${index === activeServiceIndex ? 'text-black font-bold text-2xl -translate-y-1' : 'text-gray-500 font-medium text-lg'}`}
												onClick={() => handleServiceClick(index)}
												ref={(el) => {
													if (el) serviceItemsRef.current[index] = el;
												}}
											>
												<span>{service}</span>
											</div>
										))}
									</div>
								</motion.div>
							) : (
								/* Service Detail View */
								<motion.div key='service-detail' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }} className='pt-6 detail-view-container'>
									{/* Back button */}
									<button onClick={handleBackClick} className='text-gray-500 hover:text-black transition-colors flex items-center space-x-2 mb-6 py-2'>
										<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
											<path fillRule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clipRule='evenodd' />
										</svg>
										<span>Back to services</span>
									</button>

									{/* Service title with gradient */}
									<div className='space-y-2 mb-6'>
										<motion.h1 className='text-3xl font-bold tracking-tight' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
											<span className='bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] text-transparent bg-clip-text'>{services[activeServiceIndex]}</span>
										</motion.h1>
										<div className='h-1 w-2/3 bg-gradient-to-r from-[#f4dd65] via-[#d142e2] to-[#70DFC6] rounded-full'></div>
									</div>

									{/* Service description */}
									<motion.p className='text-base text-gray-700 mb-8' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
										{serviceDescriptions[activeServiceIndex]}
									</motion.p>

									{/* Links section */}
									<motion.div className='flex flex-col space-y-4 mt-6 pt-4 border-t border-gray-200 w-full' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
										<h3 className='text-sm uppercase tracking-widest text-gray-400'>Explore More</h3>
										<a href='#' className='group flex items-center space-x-2 text-lg font-medium text-black touch-action-manipulation' onClick={handleServiceInfoClick} style={{ touchAction: 'manipulation' }} aria-label={`Explore more details about ${services[activeServiceIndex]}`}>
											<span>Learn More</span>
											<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 transform transition-transform group-hover:translate-x-1' viewBox='0 0 20 20' fill='currentColor'>
												<path fillRule='evenodd' d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z' clipRule='evenodd' />
											</svg>
										</a>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</section>
			)}
		</>
	);
}

export default MobileServicesSectionComponent;
