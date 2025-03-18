'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function HomeSection() {
	return (
		<Section id='home' className='bg-[#FAFAFA] text-black'>
			<div className='flex flex-row pl-60 gap-10'>
				<div className='space-y-0 z-100 '>
					<div className='mt-0 pt-0'>
						<motion.h1 className='text-5xl md:text-7xl font-black leading-none' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
							<span className='text-[#70DFC6]'>People</span> <span className='text-black'>are</span> <span className='text-[#F4DD65]'>fascinating</span>
							<span className='text-black'>.</span>
						</motion.h1>
						<motion.h2 className='text-4xl md:text-6xl font-black leading-tight mt-0' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
							Research should be too.
						</motion.h2>
					</div>

					<motion.p className='text-lg max-w-xl mt-2' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
						We transform complex data into meaningful insights through meticulous, human-centered research
					</motion.p>

					<motion.div className='flex gap-6' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
						<div className='mt-10 space-x-10'>
							<button className='font-medium cursor-pointer hover:underline '>Talk to us</button>
							<button className='font-medium cursor-pointer hover:underline'>See our work</button>
						</div>
					</motion.div>
				</div>

				<motion.div className='md:w-full relative max-w-2xl' initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
					<video className='w-full rounded-lg scale-150 -ml-36' autoPlay loop muted playsInline>
						<source src='/video/home-page-video.mp4' type='video/mp4' />
						Your browser does not support the video tag.
					</video>
				</motion.div>
			</div>
		</Section>
	);
}
