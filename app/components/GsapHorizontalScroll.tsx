'use client';

import { useState, useRef, RefObject, useEffect } from 'react';
import { GsapHorizontalScrollProps } from './scroll/types';
import { useNavigationControls } from './scroll/useNavigationControls';
import { useScrollSetup } from './scroll/useScrollSetup';
import { useScrollInitializer } from './scroll/useScrollInitializer';
import { useEventHandlers } from './scroll/useEventHandlers';
import ScrollNavigation from './scroll/ScrollNavigation';
import gsap from 'gsap';
import Image from 'next/image';

type HTMLDivRef = RefObject<HTMLDivElement>;

// Define type for horizontal scroll controls
interface HorizontalScrollControls {
	nextPanel: () => void;
	prevPanel: () => void;
	navigateToPanel: (index: number) => void;
	activeIndex: number;
}

// Extend Window interface
declare global {
	interface Window {
		horizontalScrollControls?: HorizontalScrollControls;
	}
}

export default function GsapHorizontalScroll({ children }: GsapHorizontalScrollProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [needsVerticalScroll, setNeedsVerticalScroll] = useState(false);
	
	// Loading animation refs
	const loadingRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLImageElement>(null);
	const sloganRef = useRef<HTMLDivElement>(null);
	const dotsRef = useRef<HTMLDivElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);

	// Get the total number of sections
	const sectionsCount = Array.isArray(children) ? children.length : 1;

	// Set up navigation controls
	const { activeIndex, isAnimating, sectionsRef, wrapperRef, navigateToPanel, nextPanel, prevPanel } = useNavigationControls(sectionsCount);

	// Initialize GSAP
	useScrollSetup();

	// Initialize scroll setup
	useScrollInitializer({
		containerRef: containerRef as HTMLDivRef,
		wrapperRef,
		sectionsRef,
		navigateToPanel,
		nextPanel,
		prevPanel,
		activeIndex,
		isAnimating,
		sectionsCount,
		setIsInitialized,
	});

	// Set up event handlers
	useEventHandlers({
		containerRef: containerRef as HTMLDivRef,
		sectionsRef,
		activeIndex,
		isAnimating,
		nextPanel,
		prevPanel,
		navigateToPanel,
	});

	// Animate loading screen
	useEffect(() => {
		if (!isInitialized && loadingRef.current) {
			const tl = gsap.timeline({ repeat: -1 });
			
			// Initial setup
			gsap.set([logoRef.current, sloganRef.current, dotsRef.current], { 
				opacity: 0, 
				y: 50 
			});
			
			// Background gradient animation
			if (backgroundRef.current) {
				gsap.to(backgroundRef.current, {
					backgroundPosition: '200% center',
					duration: 3,
					ease: 'none',
					repeat: -1
				});
			}
			
			// Logo entrance
			tl.to(logoRef.current, {
				opacity: 1,
				y: 0,
				duration: 1.2,
				ease: 'power3.out'
			})
			// Logo breathing effect
			.to(logoRef.current, {
				scale: 1.05,
				duration: 1.5,
				ease: 'sine.inOut',
				repeat: -1,
				yoyo: true
			}, '-=0.5')
			// Slogan entrance
			.to(sloganRef.current, {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out'
			}, '-=1')
			// Dots entrance and animation
			.to(dotsRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out'
			}, '-=0.5');
			
			// Animate individual dots
			const dots = dotsRef.current?.children;
			if (dots) {
				gsap.fromTo(Array.from(dots), 
					{ scale: 0.5, opacity: 0.3 },
					{
						scale: 1,
						opacity: 1,
						duration: 0.6,
						stagger: 0.2,
						repeat: -1,
						yoyo: true,
						ease: 'power2.inOut'
					}
				);
			}
			
			return () => {
				tl.kill();
			};
		}
	}, [isInitialized]);

	// Check if vertical scroll is needed based on viewport height
	useEffect(() => {
		const checkVerticalScroll = () => {
			if (typeof window !== 'undefined') {
				const viewportHeight = window.innerHeight;
				const restrictiveThreshold = 600; // Same as event handlers
				const needsScroll = viewportHeight < restrictiveThreshold;
				
				// Also check if there's actually scrollable content
				if (containerRef.current && needsScroll) {
					const container = containerRef.current;
					const hasScrollableContent = container.scrollHeight > container.clientHeight;
					setNeedsVerticalScroll(needsScroll && hasScrollableContent);
				} else {
					setNeedsVerticalScroll(false);
				}
			}
		};

		checkVerticalScroll();
		window.addEventListener('resize', checkVerticalScroll);

		return () => {
			window.removeEventListener('resize', checkVerticalScroll);
		};
	}, []);

	// Expose navigation controls for other components to use
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.horizontalScrollControls = {
				nextPanel,
				prevPanel,
				navigateToPanel,
				activeIndex: activeIndex.current,
			};
		}

		return () => {
			if (typeof window !== 'undefined') {
				delete window.horizontalScrollControls;
			}
		};
	}, [navigateToPanel, nextPanel, prevPanel, activeIndex]);

	return (
		<>
			{/* Main container */}
			<div 
				ref={containerRef} 
				className={`fixed inset-0 ${needsVerticalScroll ? 'overflow-x-auto overflow-y-auto' : 'overflow-x-hidden overflow-y-hidden'}`} 
				style={{ minHeight: '800px' }}
			>
				{/* Horizontal scroll wrapper */}
				<div 
					ref={wrapperRef} 
					className='h-full flex flex-nowrap' 
					style={{ 
						willChange: 'transform', 
						transform: 'translateX(0px)', 
						minHeight: '800px',
						width: needsVerticalScroll ? `${sectionsCount * 100}vw` : '100%' // Make content wider when scrollbars needed
					}}
				>
					{/* Sections container */}
					<div ref={sectionsRef} className='flex flex-nowrap h-full' style={{ minHeight: '800px' }}>
						{children}
					</div>
				</div>
			</div>

			{/* Navigation components */}
			<ScrollNavigation />

			{/* Trendy Animated Loading Screen */}
			{!isInitialized && (
				<div 
					ref={loadingRef}
					className='fixed inset-0 z-[100] flex items-center justify-center overflow-hidden'
				>
					{/* Animated Background */}
					<div 
						ref={backgroundRef}
						className='absolute inset-0 opacity-90'
						style={{
							background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%)',
							backgroundSize: '200% 200%',
							backgroundPosition: '0% center'
						}}
					/>
					
					{/* Floating particles effect */}
					<div className='absolute inset-0 overflow-hidden'>
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								className='absolute w-1 h-1 bg-white rounded-full opacity-20'
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 3}s`,
									animation: 'float 6s ease-in-out infinite'
								}}
							/>
						))}
					</div>
					
					{/* Main content container */}
					<div className='relative z-10 text-center px-8 max-w-2xl mx-auto'>
						{/* Logo */}
						<div className='mb-8 flex justify-center'>
							<Image
								ref={logoRef}
								src='/sotrixa-logo.webp'
								alt='Sotrixa Logo'
								width={200}
								height={100}
								className='opacity-0 transform translate-y-12'
								priority
							/>
						</div>
						
						{/* Slogan */}
						<div 
							ref={sloganRef}
							className='mb-12 opacity-0 transform translate-y-12'
						>
							<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight'>
								We are a strategy lab for{' '}
								<span className='bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
									visionary thinkers
								</span>
							</h2>
							<p className='text-gray-300 text-lg md:text-xl opacity-80'>
								Crafting experiences that matter
							</p>
						</div>
						
						{/* Loading dots */}
						<div 
							ref={dotsRef}
							className='flex justify-center space-x-2 opacity-0 transform translate-y-12'
						>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className='w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'
								/>
							))}
						</div>
						
						{/* Progress indicator */}
						<div className='mt-8 flex justify-center'>
							<div className='w-32 h-0.5 bg-gray-700 rounded-full overflow-hidden'>
								<div 
									className='h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'
									style={{
										animation: 'progress 3s ease-in-out infinite'
									}}
								/>
							</div>
						</div>
					</div>
					
					{/* Custom CSS for animations */}
					<style jsx>{`
						@keyframes float {
							0%, 100% { transform: translateY(0px) rotate(0deg); }
							50% { transform: translateY(-20px) rotate(180deg); }
						}
						
						@keyframes progress {
							0% { width: 0%; }
							50% { width: 70%; }
							100% { width: 100%; }
						}
					`}</style>
				</div>
			)}
		</>
	);
}
