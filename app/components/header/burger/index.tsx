'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import styles from './style.module.scss';

interface BurgerProps {
	openMenu: () => void;
	isMenuOpen: boolean;
	isScrolled: boolean;
}

export default function Burger({ openMenu, isMenuOpen, isScrolled }: BurgerProps) {
	const burger = {
		closed: {
			rotate: 0,
		},
		opened: {
			rotate: 45,
		},
	};

	const burgerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (burgerRef.current) {
			const burgerElement = burgerRef.current;

			const handleMouseEnter = () => {
				gsap.to(burgerElement.querySelectorAll('svg line'), {
					x: 5,
					duration: 0.3,
					ease: 'power2.out',
					stagger: 0.05,
				});
			};

			const handleMouseLeave = () => {
				gsap.to(burgerElement.querySelectorAll('svg line'), {
					x: 0,
					duration: 0.3,
					ease: 'power2.out',
					stagger: 0.05,
				});
			};

			burgerElement.addEventListener('mouseenter', handleMouseEnter);
			burgerElement.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				burgerElement.removeEventListener('mouseenter', handleMouseEnter);
				burgerElement.removeEventListener('mouseleave', handleMouseLeave);
			};
		}
	}, []);

	return (
		<div className={styles.burgerContainer} ref={burgerRef}>
			<motion.div
				className={styles.burger}
				variants={burger}
				animate={isMenuOpen ? 'opened' : 'closed'}
				onClick={openMenu}
			>
				<div className={styles.bounds}></div>
				<div className={'burgerMenu ' + styles.burgerInner}>
					<svg width='60' height='40' viewBox='0 0 60 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<line x1='5' y1='10' x2='55' y2='10' stroke={isScrolled ? 'black' : 'white'} strokeWidth='2' />
						<line x1='5' y1='20' x2='55' y2='20' stroke={isScrolled ? 'black' : 'white'} strokeWidth='2' />
						<line x1='5' y1='30' x2='55' y2='30' stroke={isScrolled ? 'black' : 'white'} strokeWidth='2' />
					</svg>
					<p style={{ color: isScrolled ? 'black' : 'white', margin: 0, fontWeight: 500, fontSize: '14px' }}>
						MENU
					</p>
				</div>
			</motion.div>
		</div>
	);
}
