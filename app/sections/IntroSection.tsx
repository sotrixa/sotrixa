'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function IntroSection() {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	// Auto-focus the video when it starts playing
	useEffect(() => {
		if (isVideoPlaying && videoRef.current) {
			// Short delay to ensure DOM is ready
			setTimeout(() => {
				videoRef.current?.focus();
			}, 100);
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

		if (videoRef.current) {
			// Ensure video is paused before closing
			videoRef.current.pause();
			// Reset video position to start
			videoRef.current.currentTime = 0;
		}
		setIsVideoPlaying(false);
	};

	return (
		<>
			<Section id='intro' className='bg-[#FAFAFA] text-black'>
				<div className='flex flex-col md:flex-row items-center justify-between gap-10'>
					<div className='md:w-1/2 ml-25'>
						<motion.div className='space-y-6' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
							<h1 className='text-7xl md:text-8xl font-black leading-none'>
								<span className='text-black'>The </span>
								<span className='text-[#d142e2]'>future </span>
								<span className='text-black'>
									of
									<br />
								</span>
								<span className='text-[#70DFC6]'>research </span>
								<span className='text-black'>is </span>
								<span className='text-[#f4dd65]'>here</span>
							</h1>
							<p className='text-xl font-medium'>SOTRIXA in 60 seconds</p>
						</motion.div>
					</div>

					<motion.div className='md:w-1/2 relative' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
						<div className='relative -ml-36 w-full h-[500px]'>
							{!isVideoPlaying ? (
								<>
									<Image src='/intro-section.webp' alt='Sotrixa research visualization' fill className='object-contain scale-150' priority />
									<div className='absolute -top-20 left-10 inset-0 flex items-center justify-center pointer-events-none'>
										<div className='pointer-events-auto'>
											<button type='button' className='bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d142e2] group' onClick={handlePlayClick} aria-label='Play Sotrixa introduction video'>
												<div className='w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform'>
													<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6 text-[#d142e2]'>
														<path d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' />
													</svg>
												</div>
											</button>
										</div>
									</div>
								</>
							) : (
								<div className='relative w-full h-full bg-black rounded-xl overflow-hidden shadow-lg'>
									<button className='absolute top-4 right-4 bg-white/90 rounded-full cursor-pointer p-2 hover:bg-white transition-colors z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white group' onClick={handleCloseVideo} aria-label='Close video'>
										<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='w-6 h-6 text-black group-hover:scale-110 transition-transform'>
											<line x1='18' y1='6' x2='6' y2='18'></line>
											<line x1='6' y1='6' x2='18' y2='18'></line>
										</svg>
									</button>

									<video ref={videoRef} className='w-full h-full object-contain rounded-xl' controls autoPlay playsInline onError={() => console.error('Video failed to load')} tabIndex={0}>
										<source src='/video/home-page-video.mp4' type='video/mp4' />
										<p className='p-4 text-white text-center'>Your browser does not support the video tag. Please use a modern browser to view this video.</p>
									</video>
								</div>
							)}

							<div className='absolute bottom-0 left-0 right-0 text-center'>
								<div className='mt-4'>
									<p className='text-lg max-w-xl mx-auto'>At Sotrixa the extensive consumer insights have been transformative, shaping our business and communications strategy fundamentals.</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</Section>
		</>
	);
}
