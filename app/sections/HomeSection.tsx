'use client';

import { useState, useEffect } from 'react';
import styles from './HomeSection.module.css';

export default function HomeSection() {
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const getBlocks = () => {
		const blockSize = windowWidth * 0.02;
		const nbOfBlocks = Math.ceil(window.innerHeight / blockSize);
		return [...Array(nbOfBlocks).keys()].map((_, index) => {
			return <div key={index} onMouseEnter={(e) => colorize(e.target as HTMLDivElement)} />;
		});
	};

	const colorize = (el: HTMLDivElement) => {
		el.style.backgroundColor = 'black';
		setTimeout(() => {
			el.style.backgroundColor = 'transparent';
		}, 300);
	};

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<h1 className={styles.heading}>
					<span className={styles.teal}>People</span> <span className={styles.white}>are</span> <span className={styles.yellow}>fascinating</span>
					<span className={styles.black}>.</span>
				</h1>
				<h2 className={styles.subheading}>Research should be too.</h2>
				<p className={styles.paragraph}>We transform complex data into meaningful insights through meticulous, human-centered research</p>
				<div className={styles.buttons}>
					<button className={styles.button}>Talk to us</button>
					<button className={styles.button}>See our work</button>
				</div>
			</div>

			<div className={styles.videoContainer}>
				<video className={styles.video} autoPlay loop muted playsInline>
					<source src='/video/home-page-video.mp4' type='video/mp4' />
					Your browser does not support the video tag.
				</video>
			</div>

			<div className={styles.grid}>
				{windowWidth > 0 &&
					[...Array(40).keys()].map((_, index) => (
						<div key={'b_' + index} className={styles.column}>
							{getBlocks()}
						</div>
					))}
			</div>
		</div>
	);
}
