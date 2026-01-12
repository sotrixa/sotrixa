'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../data/LanguageContext';
import { getText } from '../../data/translations';
import ReactDOM from 'react-dom';
import ScrollToTopButtonComponent from '../../components/ScrollToTopButton';

function MobileIntroSectionComponent() {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [isVideoHovered, setIsVideoHovered] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const { language } = useLanguage();

	// Auto-focus the video when it starts playing
	useEffect(() => {
		if (isVideoPlaying) {
			// Short delay to ensure DOM is ready
			setTimeout(() => {
				videoRef.current?.focus();
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
			if (videoRef.current) {
				videoRef.current.play().catch((error) => {
					console.error('Video playback failed:', error);
				});
			}
		}, 50);
	};

	const handleCloseVideo = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Pause and reset video
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
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
			return <span key={i}>{part}</span>;
		});
	};

	// Split the title into two parts
	const titleText = getText('introSection.title', language).split('\n');
	const firstLine = titleText[0] || '';
	const secondLine = titleText[1] || '';
	const subheadingText = getText('introSection.subheading', language);
	const testimonialText = getText('introSection.testimonial', language);

	// Mobile fullscreen video overlay
	const renderMobileVideoOverlay = () => {
		if (!isVideoPlaying) return null;

		// Use portal to render the overlay at the document body level
		return ReactDOM.createPortal(
			<div className='fixed inset-0 z-[9999] bg-black/35 flex items-center justify-center' style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
				<div className='relative w-[90%] aspect-video mx-auto max-w-lg max-h-[80vh]' onMouseEnter={() => setIsVideoHovered(true)} onMouseLeave={() => setIsVideoHovered(false)} onTouchStart={() => setIsVideoHovered(true)} onTouchEnd={() => setIsVideoHovered(false)}>
					<button className='absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group' onClick={handleCloseVideo} aria-label='Close video'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='w-5 h-5 text-black group-hover:scale-110 transition-transform'>
							<line x1='18' y1='6' x2='6' y2='18'></line>
							<line x1='6' y1='6' x2='18' y2='18'></line>
						</svg>
					</button>

					<video ref={videoRef} className='w-full h-full object-cover' controls={isVideoHovered} autoPlay playsInline onError={() => console.error('Mobile video failed to load')} tabIndex={0}>
						<source src='/video/Sotrixa-final.mp4' type='video/mp4' />
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

			<section id='intro' className='bg-[#FAFAFA] text-black relative h-screen flex items-center justify-center'>
				{/* Mobile-only background image */}
				<div
					className='absolute inset-0 z-0'
					style={{
						backgroundImage: 'url(/intro-section.webp)',
						backgroundSize: 'cover',
						backgroundPosition: 'center center',
						backgroundRepeat: 'no-repeat',
						opacity: 0.4,
					}}
				/>

				<div className='relative z-10 w-full px-4 flex items-center justify-center'>
					<motion.div className='w-full max-w-md text-center space-y-4' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
						<h1 className='text-3xl font-black leading-tight'>{renderColoredText(firstLine)}</h1>
						<h2 className='text-3xl font-black leading-tight'>{renderColoredText(secondLine)}</h2>

						{/* Subheading with play button */}
						<div className='flex items-center justify-center gap-3 mt-4'>
							<p className='text-lg font-medium'>{subheadingText}</p>

							{/* Play button */}
							<button type='button' className='bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d142e2] group' onClick={handlePlayClick} aria-label='Play Sotrixa introduction video'>
								<div className='w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4 text-[#d142e2]'>
										<path d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' />
									</svg>
								</div>
							</button>
						</div>

						{/* Testimonial */}
						<div className='mt-6'>
							<p className='text-sm leading-tight py-2 px-3 rounded-md'>{testimonialText}</p>
						</div>
					</motion.div>
				</div>

				<ScrollToTopButtonComponent />
			</section>
		</>
	);
}
export default MobileIntroSectionComponent;

