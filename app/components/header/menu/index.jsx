import { motion } from 'framer-motion';
import { opacity, slideLeft, mountAnim } from '../anim';
import styles from './style.module.scss';
import Link from './link';
import { useState } from 'react';

const menu = [
	{
		title: 'ABOUT US',
		description: 'Our Story & Vision',
		images: ['about1.jpg', 'about2.jpg'],
		sectionIndex: 3, // Index position in the page (0-indexed)
	},
	{
		title: 'SERVICES',
		description: 'What We Offer',
		images: ['services1.jpg', 'services2.jpg'],
		sectionIndex: 2, // Index position in the page (0-indexed)
	},
	{
		title: 'CASE STUDY',
		description: 'Our Work & Results',
		images: ['case1.jpg', 'case2.jpg'],
		sectionIndex: 4, // Index position in the page (0-indexed)
	},
];

export default function index({ closeMenu }) {
	const handleNavigation = (sectionIndex) => {
		// Close menu first
		closeMenu();

		// Navigate to the section using the window.horizontalScrollControls
		setTimeout(() => {
			// Use the global navigation if available
			if (window.horizontalScrollControls) {
				window.horizontalScrollControls.navigateToPanel(sectionIndex);
			} else {
				// Fallback - try to find the element directly
				const sections = document.querySelectorAll('section');
				if (sections[sectionIndex]) {
					sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
				}
			}
		}, 300); // Small delay to allow menu closing animation
	};

	return (
		<motion.div className={styles.menu} variants={opacity} initial='initial' animate='enter' exit='exit'>
			<div className={styles.header}>
				<motion.svg
					variants={slideLeft}
					{...mountAnim}
					onClick={() => {
						closeMenu();
					}}
					width='68'
					height='68'
					viewBox='0 0 68 68'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M1.5 1.5L67 67' stroke='white' />
					<path d='M66.5 1L0.999997 66.5' stroke='white' />
				</motion.svg>
			</div>

			<div className={styles.body}>
				{menu.map((el, index) => {
					return <Link data={el} index={index} key={index} onClick={() => handleNavigation(el.sectionIndex)} />;
				})}
			</div>

			<motion.div variants={opacity} {...mountAnim} custom={0.5} className={styles.footer}>
				<a>FB</a>
				<a>IG</a>
				<a>IN</a>
				<a>BE</a>
			</motion.div>
		</motion.div>
	);
}
