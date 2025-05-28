'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { getText } from '../data/translations';
import ReactDOM from 'react-dom';

export default function IntroSection() {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const desktopVideoRef = useRef<HTMLVideoElement>(null);

	// Auto-focus the video when it starts playing
	useEffect(() => {
		if (isVideoPlaying) {
			// Short delay to ensure DOM is ready
			setTimeout(() => {
				// Focus the appropriate video ref based on viewport size
				if (window.innerWidth >= 768) {
					desktopVideoRef.current?.focus();
				} else {
					videoRef.current?.focus();
				}
			}, 100);
		}
	}, [isVideoPlaying]);

	// Prevent body scrolling when video is playing on mobile
	useEffect(() => {
		if (isVideoPlaying) {
			// Save current scroll position
			const scrollY = window.scrollY;
			// Add styles to body
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
			document.body.style.top = `-${scrollY}px`;
		} else {
			// Restore scroll position
			const scrollY = document.body.style.top;
			document.body.style.position = '';
			document.body.style.width = '';
			document.body.style.top = '';
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
			}
		}
	}, [isVideoPlaying]);

	const handlePlayClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsVideoPlaying(true);

		// Wait for state update then play video
		setTimeout(() => {
			// Play the appropriate video based on viewport size
			if (window.innerWidth >= 768) {
				if (desktopVideoRef.current) {
					desktopVideoRef.current.play().catch((error) => {
						console.error('Desktop video playback failed:', error);
					});
				}
			} else {
				if (videoRef.current) {
					videoRef.current.play().catch((error) => {
						console.error('Mobile video playback failed:', error);
					});
				}
			}
		}, 50);
	};

	const handleCloseVideo = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Pause and reset both videos
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
		}

		if (desktopVideoRef.current) {
			desktopVideoRef.current.pause();
			desktopVideoRef.current.currentTime = 0;
		}

		setIsVideoPlaying(false);
	};

	const renderColoredText = (text: string) => {
		// Parse the text with color markers {{word:#color}}
		const parts = text.split(/(\{\{.*?\}\})/g);

		return parts.map((part, i) => {
			// Check if this part is a color marker
			const match = part.match(/\{\{(.*?):(.*?)\}\}/);
			if (match) {
				const [, word, color] = match;
				return (
					<span key={i} style={{ color }}>
						{word}
					</span>
				);
			}

			// Check if this part contains an em dash and style it smaller
			if (part.includes('—')) {
				const dashParts = part.split('—');
				const elements: React.ReactElement[] = [];
				dashParts.forEach((dashPart, dashIndex) => {
					if (dashIndex > 0) {
						// Add the styled dash before each part (except the first)
						elements.push(
							<span key={`${i}-dash-${dashIndex}`} style={{ fontSize: '1em', fontWeight: '200', transform: 'scaleX(0.5)', display: 'inline-block' }}>
								—
							</span>
						);
					}
					elements.push(<span key={`${i}-text-${dashIndex}`}>{dashPart}</span>);
				});
				return elements;
			}

			return <span key={i}>{part}</span>;
		});
	};

	// Split the title into two parts
	const titleText = getText('introSection.title', 'en').split('\n');
	const firstLine = titleText[0] || '';
	const secondLine = titleText[1] || '';
	const subheadingText = getText('introSection.subheading', 'en');
	const testimonialText = getText('introSection.testimonial', 'en');

	// Conditionally render the video player or the image for desktop
	const renderVideoContent = () => {
		if (isVideoPlaying) {
			return (
				<div className='relative w-full h-full bg-black rounded-xl overflow-hidden shadow-lg'>
					<button className='absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 hover:bg-white transition-colors z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group' onClick={handleCloseVideo} aria-label='Close video'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='w-6 h-6 text-black group-hover:scale-110 transition-transform'>
							<line x1='18' y1='6' x2='6' y2='18'></line>
							<line x1='6' y1='6' x2='18' y2='18'></line>
						</svg>
					</button>

					<video ref={desktopVideoRef} className='w-full h-full object-contain rounded-xl' controls autoPlay playsInline onError={() => console.error('Desktop video failed to load')} tabIndex={0}>
						<source src='/video/home-page-video.mp4' type='video/mp4' />
						<p className='p-4 text-white text-center'>Your browser does not support the video tag. Please use a modern browser to view this video.</p>
					</video>
				</div>
			);
		}

		return (
			<>
				{/* Desktop-only image */}
				<div className='hidden md:block'>
					<Image src='/intro-section.webp' alt='Sotrixa research visualization' fill className='object-contain scale-150' priority />
				</div>

				{/* Desktop-only play button */}
				<div className='absolute md:-top-20 md:left-10 inset-0 hidden md:flex items-center justify-center pointer-events-none'>
					<div className='pointer-events-auto'>
						<button type='button' className='rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d142e2] group' onClick={handlePlayClick} aria-label='Play Sotrixa introduction video'>
							<div className='w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6 text-[#d142e2]'>
									<path d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' />
								</svg>
							</div>
						</button>
					</div>
				</div>
			</>
		);
	};

	// Mobile fullscreen video overlay
	const renderMobileVideoOverlay = () => {
		if (!isVideoPlaying) return null;

		// Use portal to render the overlay at the document body level
		return ReactDOM.createPortal(
			<div className='fixed inset-0 z-[9999] bg-black/35 flex items-center justify-center md:hidden' style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
				<div className='relative w-[90%] aspect-video mx-auto max-w-lg max-h-[80vh]'>
					<button className='absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group' onClick={handleCloseVideo} aria-label='Close video'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='w-5 h-5 text-black group-hover:scale-110 transition-transform'>
							<line x1='18' y1='6' x2='6' y2='18'></line>
							<line x1='6' y1='6' x2='18' y2='18'></line>
						</svg>
					</button>

					<video ref={videoRef} className='w-full h-full object-contain' controls autoPlay playsInline onError={() => console.error('Mobile video failed to load')} tabIndex={0}>
						<source src='/video/home-page-video.mp4' type='video/mp4' />
						<p className='p-4 text-white text-center'>Your browser does not support the video tag. Please use a modern browser to view this video.</p>
					</video>
				</div>
			</div>,
			document.body
		);
	};

	return (
		<>
			{/* Mobile fullscreen video overlay */}
			{renderMobileVideoOverlay()}

			<Section id='intro' className='bg-[#FAFAFA] text-black relative'>
				{/* Mobile-only background image */}
				<div
					className='md:hidden absolute inset-0 z-0'
					style={{
						backgroundImage: 'url(/intro-section.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center center',
						backgroundRepeat: 'no-repeat',
						opacity: 0.4,
					}}
				/>

				<div className='flex flex-col md:flex-row items-start justify-between md:gap-20 relative z-10 md:px-10'>
					<div className='w-full py-5 px-4 flex flex-col items-center md:items-start md:w-7/12 md:px-0'>
						<motion.div className='w-full max-w-md md:max-w-none text-left md:text-left space-y-2 md:space-y-6 md:bg-transparent p-4 rounded-lg md:p-0 md:rounded-none md:shadow-none' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
							{/* Title with optimized font sizes */}
							<div className='mb-6 md:pt-30 md:mb-8 pl-10'>
								<div className='space-y-2 md:space-y-4'>
									<h1 className='text-3xl md:text-[2rem] lg:text-[2.7rem] font-black leading-tight md:leading-none block'>{renderColoredText(firstLine)}</h1>
									<h1 className='text-3xl md:text-[2.7rem] font-black leading-tight md:leading-none block'>{renderColoredText(secondLine)}</h1>
								</div>
							</div>

							{/* Subheading in its own row */}
							<div className='w-full mt-6 pl-10'>
								<p className='text-lg md:text-xl font-serif'>{subheadingText}</p>

								{/* Mobile-only play button */}
								<button type='button' className='block md:hidden mt-4 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d142e2] group' onClick={handlePlayClick} aria-label='Play Sotrixa introduction video'>
									<div className='w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform'>
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4 text-[#d142e2]'>
											<path d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' />
										</svg>
									</div>
								</button>
							</div>

							{/* Mobile-only testimonial */}
							<div className='block md:hidden mt-6'>
								<p className='text-sm leading-tight py-2 px-3 rounded-md'>{testimonialText}</p>
							</div>
						</motion.div>
					</div>

					{/* Desktop-only video container with proper spacing */}
					<motion.div className='hidden md:block md:w-7/12 relative' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
						<div className='relative w-full h-[420px]'>
							{renderVideoContent()}

							{/* Desktop-only testimonial */}
							<div className='hidden md:block absolute bottom-0 left-0 right-0 text-center'>
								<div className='mt-4'>
									<p className='text-lg max-w-xl mx-auto'>{testimonialText}</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</Section>
		</>
	);
}
