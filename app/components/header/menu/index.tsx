import { motion } from 'framer-motion';
import { opacity, slideLeft, mountAnim } from '../anim';
import styles from './style.module.scss';
import Link from './link';
import { usePathname } from 'next/navigation';

interface MenuItem {
	title: string;
	description: string;
	images: string[];
	sectionIndex?: number;
	sectionId?: string;
	path?: string;
}

interface MenuProps {
	closeMenu: () => void;
}

// Type guard for horizontalScrollControls
const hasHorizontalScrollControls = (win: Window): win is Window & { horizontalScrollControls: { navigateToPanel: (index: number) => void } } => {
	return (
		'horizontalScrollControls' in win &&
		win.horizontalScrollControls !== undefined &&
		typeof win.horizontalScrollControls === 'object' &&
		win.horizontalScrollControls !== null &&
		'navigateToPanel' in win.horizontalScrollControls &&
		typeof (win.horizontalScrollControls as unknown as Record<string, unknown>).navigateToPanel === 'function'
	);
};

const menu: MenuItem[] = [
	{
		title: 'ABOUT US',
		description: 'Our Story & Vision',
		images: ['about1.jpg', 'about2.jpg'],
		sectionIndex: 1, // Changed from 3 to 0 to navigate to the intro section
		sectionId: 'intro', // Add section ID for direct link
	},
	{
		title: 'SERVICES',
		description: 'What We Offer',
		images: ['services1.jpg', 'services2.jpg'],
		sectionIndex: 2, // Index position in the page (0-indexed)
		sectionId: 'services', // Add section ID for direct link
	},
	{
		title: 'CASE STUDIES',
		description: 'Our Work & Results',
		images: ['case1.jpg', 'case2.jpg'],
		sectionIndex: 3, // Index position in the page (0-indexed)
		sectionId: 'case-study', // Add section ID for direct link
	},
	{
		title: 'CREATED TO MATTER',
		description: 'Our Purpose & Mission',
		images: ['agence1.jpg', 'agence2.jpg'],
		sectionIndex: 4,
		sectionId: 'created-to-matter',
		path: '/created-to-matter',
	},
];

export default function Menu({ closeMenu }: MenuProps) {
	const pathname = usePathname();
	const isOnMainPage = pathname === '/';

	const handleNavigation = (item: MenuItem) => {
		// Close menu first
		closeMenu();

		// If it's a direct path and we're already on that path, just close the menu
		if (item.path && pathname === item.path) {
			return;
		}

		// If it's a direct path, navigate to the page
		if (item.path) {
			setTimeout(() => {
				window.location.href = item.path!;
			}, 300);
			return;
		}

		// If we're not on the main page, we need to navigate to the main page first
		if (!isOnMainPage) {
			setTimeout(() => {
				// Navigate to main page with section ID
				window.location.href = `/#${item.sectionId}`;
			}, 300);
			return;
		}

		// On main page, use horizontal scroll controls if available
		setTimeout(() => {
			// Use the global navigation if available
			if (hasHorizontalScrollControls(window) && item.sectionIndex !== undefined) {
				window.horizontalScrollControls.navigateToPanel(item.sectionIndex);
			} else {
				// Fallback - try to find the element directly
				const targetSection = document.getElementById(item.sectionId || '');
				if (targetSection) {
					targetSection.scrollIntoView({ behavior: 'smooth' });
				} else {
					// Fallback to index-based selection if ID not found
					const sections = document.querySelectorAll('section');
					if (item.sectionIndex !== undefined && sections[item.sectionIndex]) {
						sections[item.sectionIndex].scrollIntoView({ behavior: 'smooth' });
					}
				}
			}
		}, 300); // Small delay to allow menu closing animation
	};

	return (
		<motion.div className={styles.menu} variants={opacity} initial='initial' animate='enter' exit='exit'>
			<div className={styles.header}>
				<motion.svg
					variants={slideLeft}
					{...mountAnim}
					onClick={() => {
						closeMenu();
					}}
					width='68'
					height='68'
					viewBox='0 0 68 68'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={styles.closeButton}
				>
					<path d='M1.5 1.5L67 67' stroke='white' />
					<path d='M66.5 1L0.999997 66.5' stroke='white' />
				</motion.svg>
			</div>

			<div className={styles.body}>
				{menu.map((el, index) => {
					return <Link data={el} index={index} key={index} onClick={() => handleNavigation(el)} />;
				})}
			</div>

			<motion.div variants={opacity} {...mountAnim} custom={0.5} className={styles.footer}>

			       <div className='flex gap-4'>
				   <a href="https://www.instagram.com/sotrixa" target="_blank" rel="noopener noreferrer" className='uppercase'>Instagram</a>
				   <a href="https://www.linkedin.com/sotrixa" target="_blank" rel="noopener noreferrer" className='uppercase'>LinkedIn</a>
				   </div>

			</motion.div>
		</motion.div>
	);
}
