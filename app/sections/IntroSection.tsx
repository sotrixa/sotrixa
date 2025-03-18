'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function IntroSection() {
	const [isVideoOpen, setIsVideoOpen] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handlePlayClick = (e: React.MouseEvent) => {
		// Prevent ANY event propagation
		e.preventDefault();
		e.stopPropagation();
		setIsVideoOpen(true);
		// Return false to prevent additional handlers
		return false;
	};

	const handleCloseVideo = () => {
		setIsVideoOpen(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	};

	return (
		<>
			<Section id='intro' className='bg-[#FAFAFA] text-black'>
				<div className='flex flex-col md:flex-row items-center justify-between gap-10'>
					<div className='md:w-1/2'>
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
							<Image src='/intro-section.webp' alt='Sotrixa research visualization' fill className='object-contain scale-150' priority />
							<div className='absolute -top-20 left-10 inset-0 flex items-center justify-center pointer-events-none'>
								<div className='pointer-events-auto'>
									<button
										type='button'
										className='bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none'
										onClick={handlePlayClick}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										aria-label='Play video'
									>
										<div className='w-10 h-10 flex items-center justify-center'>
											<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
												<path d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' />
											</svg>
										</div>
									</button>
								</div>
							</div>

							<div className='absolute bottom-0 left-0 right-0 text-center'>
								<div className='mt-4'>
									<p className='text-lg max-w-xl mx-auto'>At Sotrixa the extensive consumer insights have been transformative, shaping our business and communications strategy fundamentals.</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</Section>

			{/* Video Modal */}
			{isVideoOpen && (
				<div className='fixed inset-0 z-[9999] bg-gray-200/60  bg-opacity-80 flex items-center justify-center'>
					<div className='relative w-full max-w-[20%] md:max-w-[45%] h-[500px] '>
						<button className='absolute top-2 right-2 bg-white rounded-full cursor-pointer p-2 hover:bg-gray-100 z-10' onClick={handleCloseVideo}>
							<Image src='/menu-close.svg' alt='Close' width={24} height={24} />
						</button>

						<video ref={videoRef} className='w-full h-full object-contain rounded-3xl' controls autoPlay>
							<source src='/video/home-page-video.mp4' type='video/mp4' />
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			)}
		</>
	);
}
