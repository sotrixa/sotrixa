'use client';

import { useLanguage } from '../data/LanguageContext';

export default function LanguageSwitcher() {
	const { language, setLanguage } = useLanguage();

	const toggleLanguage = () => {
		setLanguage(language === 'en' ? 'bg' : 'en');
	};

	return (
		<button
			onClick={toggleLanguage}
			style={{
				position: 'fixed',
				top: '20px',
				right: '20px',
				zIndex: 1000,
				padding: '8px 12px',
				backgroundColor: '#fff',
				border: '1px solid #ddd',
				borderRadius: '4px',
				cursor: 'pointer',
				fontSize: '14px',
			}}
		>
			{language === 'en' ? 'BG' : 'EN'}
		</button>
	);
}
