'use client';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Burger from './burger';
import Stairs from './stairs';
import Menu from './menu';
import { AnimatePresence } from 'framer-motion';

export default function Header() {
	const [menuIsOpen, setMenuIsOpen] = useState(false);
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

	return (
		<div className={`${styles.header} ${isMobile ? styles.mobile : ''}`}>
			<Burger
				openMenu={() => {
					setMenuIsOpen(true);
				}}
				isMenuOpen={menuIsOpen}
			/>
			<AnimatePresence mode='wait'>
				{menuIsOpen && (
					<>
						<Stairs isMobile={isMobile} />
						<Menu
							isMobile={isMobile}
							closeMenu={() => {
								setMenuIsOpen(false);
							}}
						/>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
