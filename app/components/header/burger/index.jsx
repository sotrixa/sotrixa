'use client';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ({ openMenu, isMenuOpen = false }) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Set initial value
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (isMenuOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={() => {
				openMenu();
			}}
			className={styles.button}
		>
			<div className={styles.background}></div>
			<svg width={isMobile ? '60' : '56'} height={isMobile ? '12' : '7'} viewBox='0 0 56 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<line x1='56' y1='0.5' x2='4.37114e-08' y2='0.500005' stroke='white' strokeWidth={isMobile ? '1.5' : '1'} />
				<line x1='56' y1='6.5' x2='28' y2='6.5' stroke='white' strokeWidth={isMobile ? '1.5' : '1'} />
			</svg>
			<p>Menu</p>
		</motion.div>
	);
}
