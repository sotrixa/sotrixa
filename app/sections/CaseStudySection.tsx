'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

export default function CaseStudySection() {
	return (
		<Section id='case-study' className='bg-[#f4dd65] text-black'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-screen p-12'>
				<motion.div className='space-y-6' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
					<h2 className='text-5xl font-bold'>Our Case Studies</h2>
					<p className='text-lg'>Explore our success stories and see how we&apos;ve helped businesses like yours achieve impressive results through strategic insights and innovative solutions.</p>
					<p className='text-lg'>Each case study demonstrates our client-focused approach, methodology, and the measurable outcomes we&apos;ve delivered.</p>
				</motion.div>

				<div className='grid grid-cols-1 gap-6'>
					<motion.div className='bg-white p-6 rounded-xl shadow-lg' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
						<h3 className='text-xl font-bold mb-2'>Global Tech Brand</h3>
						<p className='mb-4'>Audience segmentation and research that drove a 45% increase in customer engagement.</p>
						<button className='px-4 py-2 bg-black text-white rounded-full'>Read Case Study</button>
					</motion.div>

					<motion.div className='bg-white p-6 rounded-xl shadow-lg' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
						<h3 className='text-xl font-bold mb-2'>E-commerce Platform</h3>
						<p className='mb-4'>Brand strategy and market positioning that resulted in 68% revenue growth.</p>
						<button className='px-4 py-2 bg-black text-white rounded-full'>Read Case Study</button>
					</motion.div>
				</div>
			</div>
		</Section>
	);
}
