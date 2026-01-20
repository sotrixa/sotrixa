'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeyboardControls() {
	const [showShortcuts, setShowShortcuts] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const container = document.querySelector('.overflow-x-auto');
			if (!container) return;

			// Toggle shortcut guide with ? key
			if (e.key === '?') {
				setShowShortcuts((prev) => !prev);
				e.preventDefault();
				return;
			}

			// Hide shortcuts guide on Escape
			if (e.key === 'Escape' && showShortcuts) {
				setShowShortcuts(false);
				e.preventDefault();
				return;
			}

			// Get all sections
			const sections = document.querySelectorAll('section');
			if (!sections.length) return;

			// Calculate current position
			const currentPosition = container.scrollLeft;
			const sectionWidth = window.innerWidth;
			const currentIndex = Math.floor(currentPosition / sectionWidth);

			let targetIndex = currentIndex;

			// Handle different keys
			switch (e.key) {
				case 'ArrowRight':
				case 'd':
				case 'D':
					// Instant scroll - direct jump for maximum speed
					container.scrollLeft += sectionWidth;
					e.preventDefault();
					break;

				case 'ArrowLeft':
				case 'a':
				case 'A':
					// Instant scroll - direct jump for maximum speed
					container.scrollLeft -= sectionWidth;
					e.preventDefault();
					break;

				case 'End':
					// Jump to last section instantly
					targetIndex = sections.length - 1;
					container.scrollLeft = targetIndex * sectionWidth;
					e.preventDefault();
					break;

				case 'Home':
					// Jump to first section instantly
					container.scrollLeft = 0;
					e.preventDefault();
					break;

				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
					// Jump to numbered section instantly
					const sectionNumber = parseInt(e.key);
					if (sectionNumber <= sections.length) {
						container.scrollLeft = (sectionNumber - 1) * sectionWidth;
						e.preventDefault();
					}
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [showShortcuts]);

	return (
		<AnimatePresence>
			{showShortcuts && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80' onClick={() => setShowShortcuts(false)}>
					<motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className='bg-gray-800 rounded-xl p-8 max-w-md w-full text-white' onClick={(e) => e.stopPropagation()}>
						<h2 className='text-2xl font-bold mb-4'>Keyboard Shortcuts</h2>

						<div className='space-y-3'>
							<div className='flex justify-between'>
								<span>Right Arrow / D</span>
								<span className='text-gray-400'>Scroll right</span>
							</div>
							<div className='flex justify-between'>
								<span>Left Arrow / A</span>
								<span className='text-gray-400'>Scroll left</span>
							</div>
							<div className='flex justify-between'>
								<span>Home</span>
								<span className='text-gray-400'>First section</span>
							</div>
							<div className='flex justify-between'>
								<span>End</span>
								<span className='text-gray-400'>Last section</span>
							</div>
							<div className='flex justify-between'>
								<span>1-5 keys</span>
								<span className='text-gray-400'>Jump to section</span>
							</div>
							<div className='flex justify-between'>
								<span>?</span>
								<span className='text-gray-400'>Toggle shortcuts</span>
							</div>
							<div className='flex justify-between'>
								<span>Esc</span>
								<span className='text-gray-400'>Close shortcuts</span>
							</div>
						</div>

						<div className='mt-6 text-center'>
							<button className='px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors' onClick={() => setShowShortcuts(false)}>
								Close
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
