import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { height, background, mountAnim } from '../anim';
import { motion } from 'framer-motion';

export default function index() {
	const stairsRef = useRef(null);

	// LOCK INITIAL HEIGHT - capture once and never change
	useEffect(() => {
		if (typeof window === 'undefined' || !stairsRef.current) return;

		// Capture initial viewport height in pixels
		const initialHeight = window.innerHeight;
		const fixedHeight = Math.max(initialHeight, 800);

		// Set height in pixels - NEVER RECALCULATES
		stairsRef.current.style.height = `${fixedHeight}px`;
	}, []);

	return (
		<motion.div ref={stairsRef} className={styles.stairs}>
			{[...Array(5)].map((_, index) => {
				return <motion.div key={index} variants={height} {...mountAnim} custom={4 - index} className={styles.stair} />;
			})}
			<motion.div variants={background} {...mountAnim} className={styles.background} />
		</motion.div>
	);
}
