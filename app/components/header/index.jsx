'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import Burger from './burger';
import Stairs from './stairs';
import Menu from './menu';
import { AnimatePresence } from 'framer-motion';

export default function Header() {
	const [menuIsOpen, setMenuIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const headerRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			const scrolled = window.scrollY > 0;
			setIsScrolled(scrolled);

			// Direct DOM manipulation for maximum compatibility
			if (headerRef.current) {
				if (scrolled) {
					headerRef.current.style.backgroundColor = 'white';
					headerRef.current.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
					headerRef.current.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

					// Find all SVG lines and change their color
					const lines = headerRef.current.querySelectorAll('svg line');
					lines.forEach((line) => {
						line.setAttribute('stroke', 'black');
					});

					// Find all burger menu text and change color
					const menuText = headerRef.current.querySelector('.burgerMenu p');
					if (menuText) {
						menuText.style.color = 'black';
						menuText.style.transition = 'color 0.3s ease';
					}
				} else {
					headerRef.current.style.backgroundColor = 'transparent';
					headerRef.current.style.boxShadow = 'none';
					headerRef.current.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

					// Reset SVG line colors
					const lines = headerRef.current.querySelectorAll('svg line');
					lines.forEach((line) => {
						line.setAttribute('stroke', 'white');
					});

					// Reset burger menu text color
					const menuText = headerRef.current.querySelector('.burgerMenu p');
					if (menuText) {
						menuText.style.color = 'white';
						menuText.style.transition = 'color 0.3s ease';
					}
				}
			}
		};

		// Set initial values
		handleScroll();

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className={styles.header} ref={headerRef} role='navigation' aria-label='Main Navigation'>
			<Burger
				openMenu={() => {
					setMenuIsOpen(true);
				}}
				isMenuOpen={menuIsOpen}
				isScrolled={isScrolled}
			/>
			<AnimatePresence mode='wait'>
				{menuIsOpen && (
					<>
						<Stairs />
						<Menu
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
