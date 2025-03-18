'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function IntroSection() {
	return (
		<Section id='intro' className='bg-blue-600 text-white'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
				<motion.div className='space-y-6' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
					<h2 className='text-5xl font-bold'>Our Story</h2>
					<p className='text-lg'>Founded with a vision to transform digital experiences, we combine creativity with cutting-edge technology to deliver solutions that stand out.</p>
					<p className='text-lg'>Our innovative approach has helped businesses of all sizes achieve their goals and establish a strong digital presence.</p>
				</motion.div>

				<motion.div className='bg-blue-700 p-10 rounded-2xl' initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
					<div className='aspect-video bg-blue-800 rounded-lg flex items-center justify-center'>
						<span className='text-5xl'>🚀</span>
					</div>
				</motion.div>
			</div>
		</Section>
	);
}
