'use client';

// Rename the function to avoid conflicts
function ScrollToTopButtonComponent() {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<button onClick={scrollToTop} className='fixed bottom-6 right-6 z-50 p-3 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition-all duration-300' aria-label='Scroll to top'>
			<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
				<path d='M12 19V5M5 12l7-7 7 7' />
			</svg>
		</button>
	);
}

// Export with a different name to avoid conflicts
export default ScrollToTopButtonComponent;
