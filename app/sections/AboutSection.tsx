'use client';

import { motion } from 'framer-motion';
import Section from '../components/Section';

const stats = [
	{ value: '10+', label: 'Years Experience' },
	{ value: '200+', label: 'Projects Completed' },
	{ value: '50+', label: 'Team Members' },
	{ value: '30+', label: 'Countries Served' },
];

export default function AboutSection() {
	return (
		<Section id='about' className='bg-green-600 text-white'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
				<motion.div className='space-y-6' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
					<h2 className='text-5xl font-bold'>About Us</h2>
					<p className='text-lg'>We are a team of passionate developers, designers, and strategists committed to delivering exceptional digital solutions that drive business growth.</p>
					<p className='text-lg'>Our mission is to empower businesses with technology that transforms their operations and enhances their customer experiences.</p>
					<div className='pt-4'>
						<button className='px-6 py-3 bg-white text-green-700 rounded-full font-medium hover:bg-gray-200 transition-colors'>Meet Our Team</button>
					</div>
				</motion.div>

				<div className='grid grid-cols-2 gap-6'>
					{stats.map((stat, index) => (
						<motion.div key={stat.label} className='bg-green-700 p-6 rounded-xl text-center' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
							<span className='block text-4xl font-bold mb-2'>{stat.value}</span>
							<span className='text-green-300'>{stat.label}</span>
						</motion.div>
					))}
				</div>
			</div>
		</Section>
	);
}
