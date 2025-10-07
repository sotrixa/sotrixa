'use client';
import styles from './style.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

export default function ({ openMenu, isMenuOpen = false, isScrolled = false }) {
	if (isMenuOpen) return null;

	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		openMenu();
	};

	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={handleClick}
			className={`${styles.button} burgerMenu`}
		>
			<div className={styles.background}></div>
			<svg width='56' height='7' viewBox='0 0 56 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<line x1='56' y1='0.5' x2='4.37114e-08' y2='0.500005' stroke='white' strokeWidth='1' />
				<line x1='56' y1='6.5' x2='28' y2='6.5' stroke='white' strokeWidth='1' />
			</svg>
			<p>Menu</p>
		</motion.div>
	);
}
