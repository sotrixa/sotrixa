'use client';
import styles from '../style.module.scss';
import { motion } from 'framer-motion';
import { mountAnim, rotateX } from '../../anim';
import Image from 'next/image';
import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function link({ data, index, onClick }) {
	const { title, description, images } = data;
	const outer = useRef(null);
	const inner = useRef(null);
	const [isTouched, setIsTouched] = useState(false);

	const manageMouseEnter = (e) => {
		const bounds = e.target.getBoundingClientRect();
		if (e.clientY < bounds.top + bounds.height / 2) {
			gsap.set(outer.current, { top: '-100%' });
			gsap.set(inner.current, { top: '100%' });
		} else {
			gsap.set(outer.current, { top: '100%' });
			gsap.set(inner.current, { top: '-100%' });
		}
		gsap.to(outer.current, { top: '0%', duration: 0.3 });
		gsap.to(inner.current, { top: '0%', duration: 0.3 });
	};

	const manageMouseLeave = (e) => {
		const bounds = e.target.getBoundingClientRect();
		if (e.clientY < bounds.top + bounds.height / 2) {
			gsap.to(outer.current, { top: '-100%', duration: 0.3 });
			gsap.to(inner.current, { top: '100%', duration: 0.3 });
		} else {
			gsap.to(outer.current, { top: '100%', duration: 0.3 });
			gsap.to(inner.current, { top: '-100%', duration: 0.3 });
		}
	};

	// Handle touch events for mobile devices with improved experience
	const handleTouchStart = (e) => {
		setIsTouched(true);
		manageMouseEnter(e.touches[0]);
	};

	const handleTouchEnd = (e) => {
		setIsTouched(false);
		// Only perform the leave animation if not clicked
		setTimeout(() => {
			if (!isTouched) {
				manageMouseLeave(e.changedTouches[0]);
			}
		}, 300);
	};

	// Handle touch move to prevent issues when scrolling
	const handleTouchMove = (e) => {
		// If touch moved significantly, consider it a scroll not a tap
		const touch = e.touches[0];
		const bounds = e.target.getBoundingClientRect();
		if (touch.clientY < bounds.top - 20 || touch.clientY > bounds.bottom + 20 || touch.clientX < bounds.left - 20 || touch.clientX > bounds.right + 20) {
			setIsTouched(false);
			manageMouseLeave(touch);
		}
	};

	return (
		<motion.div
			onMouseEnter={(e) => {
				manageMouseEnter(e);
			}}
			onMouseLeave={(e) => {
				manageMouseLeave(e);
			}}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleTouchMove}
			variants={rotateX}
			{...mountAnim}
			custom={index}
			className={styles.el}
		>
			<a
				href='#'
				onClick={(e) => {
					e.preventDefault();
					if (onClick) onClick();
				}}
			>
				{title}
			</a>
			<div ref={outer} className={styles.outer}>
				<div ref={inner} className={styles.inner}>
					{[...Array(2)].map((_, index) => {
						return (
							<div key={index} className={styles.container}>
								<div className={styles.imageContainer}>
									<Image src={`/images/${images[0]}`} fill alt='image' />
								</div>
								<p>{description}</p>
								<div className={styles.imageContainer}>
									<Image src={`/images/${images[1]}`} fill alt='image' />
								</div>
								<p>{description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
}
