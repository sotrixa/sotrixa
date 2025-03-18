'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
	useEffect(() => {
		const handleAnchorClick = (e: MouseEvent) => {
			// Check if the clicked element is an anchor tag with hash
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');

			if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
				e.preventDefault();

				const targetId = anchor.getAttribute('href')?.substring(1);
				const targetElement = document.getElementById(targetId || '');

				if (targetElement) {
					// Find the scrollable container
					const container = document.querySelector('.overflow-x-auto');

					if (container) {
						// Find all section elements
						const sections = document.querySelectorAll('section');
						const targetIndex = Array.from(sections).findIndex((section) => section.id === targetId);

						if (targetIndex >= 0) {
							// Direct jump to target position
							const targetPosition = targetIndex * window.innerWidth;
							container.scrollLeft = targetPosition;

							// Update URL hash
							window.history.pushState(null, '', `#${targetId}`);
						}
					}
				}
			}
		};

		// Add event listener to document body for delegation
		document.body.addEventListener('click', handleAnchorClick);

		// Handle initial hash in URL
		const handleInitialHash = () => {
			const hash = window.location.hash.substring(1);
			if (hash) {
				const targetElement = document.getElementById(hash);
				if (targetElement) {
					const container = document.querySelector('.overflow-x-auto');
					const sections = document.querySelectorAll('section');
					const targetIndex = Array.from(sections).findIndex((section) => section.id === hash);

					if (targetIndex >= 0 && container) {
						// Direct jump to section
						container.scrollLeft = targetIndex * window.innerWidth;
					}
				}
			}
		};

		// Handle initial hash immediately to ensure fast loading
		setTimeout(handleInitialHash, 50);

		return () => {
			document.body.removeEventListener('click', handleAnchorClick);
		};
	}, []);

	return null;
}
