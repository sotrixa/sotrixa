'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function HomeSection() {
	return (
		<Section id='home' className='bg-indigo-900 text-white'>
			<div className='space-y-6'>
				<motion.h1 className='text-7xl font-bold' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
					Welcome to Our World
				</motion.h1>

				<motion.p className='text-xl max-w-2xl' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
					Scroll horizontally to discover our story, services, and mission.
				</motion.p>

				<motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
					<button className='px-8 py-3 bg-white text-indigo-900 rounded-full font-medium hover:bg-gray-200 transition-colors'>Get Started</button>
				</motion.div>
			</div>
		</Section>
	);
}
