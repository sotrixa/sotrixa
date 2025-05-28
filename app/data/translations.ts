export type Language = 'en' | 'bg';

type TranslationKey = 'homeSection.title' | 'homeSection.paragraph' | 'homeSection.talkToUs' | 'homeSection.seeOurWork' | 'homeSection.researchSubheading' | 'introSection.title' | 'introSection.subheading' | 'introSection.testimonial' | 'servicesSection.title' | 'servicesSection.subtitle' | 'caseStudySection.title' | 'caseStudySection.subtitle';

export type Translations = {
	[key in TranslationKey]: {
		[lang in Language]: string;
	};
};

export const translations: Translations = {
	'homeSection.title': {
		en: 'We are a strategy lab for visionary thinkers',
		bg: 'Ние сме стратегическа лаборатория за визионерски мислители',
	},
	'homeSection.paragraph': {
		en: 'Through deep analysis and creative design, we shape strategic direction that moves ideas forward',
		bg: 'Чрез задълбочен анализ и креативен дизайн, ниеформираме стратегическа посока, която придвижва идеите напред',
	},
	'homeSection.talkToUs': {
		en: 'Talk to us',
		bg: 'Свържете се с нас',
	},
	'homeSection.seeOurWork': {
		en: 'See our work',
		bg: 'Вижте нашата работа',
	},
	'homeSection.researchSubheading': {
		en: 'Research should be too',
		bg: 'Проучването също трябва да бъде',
	},
	'introSection.title': {
		en: 'Every {{strategy:#D142E2}} has a {{rhythm:#71DEC6}}\n—ours begins by {{listening:#F4DD65}}',
		bg: 'Всяка {{strategy:#D142E2}} има свой {{rhythm:#71DEC6}}\n—нашата започва със {{listening:#F4DD65}}',
	},
	'introSection.subheading': {
		en: 'SOTRIXA in 60 seconds',
		bg: 'SOTRIXA за 60 секунди',
	},
	'introSection.testimonial': {
		en: "Each project becomes a living story, unfolding through research, structure, strategy, and design - shaping everything from your foundation to how you're seen and remembered",
		bg: 'Всеки проект се превръща в жива история, разгръщаща се чрез изследване, структура, стратегия и дизайн -формираща всичко от вашата основа до това как сте възприемани и запомнени.',
	},
	'servicesSection.title': {
		en: 'The way we work is {{layered:#F4DD65}}, {{intentional:#D142E2}}, and deeply {{aligned:#71DEC6}}',
		bg: 'Начинът, по който работим, е {{layered:#F4DD65}}, {{intentional:#D142E2}} и дълбоко {{aligned:#71DEC6}}.',
	},
	'servicesSection.subtitle': {
		en: 'We move from insight to structure, strategy to story—building identities and experiences that hold together and move forward.',
		bg: 'Преминаваме от прозрение към структура, от стратегия към история—изграждайки идентичности и преживявания, които се свързват и вървят напред.',
	},
	'caseStudySection.title': {
		en: 'We {{build:#F4DD65}} with {{purpose:#D142E2}}—and every outcome reflects the {{thinking:#71DDC6}} behind it',
		bg: 'Ние {{build:#F4DD65}} с {{purpose:#D142E2}}—и всеки резултат отразява {{thinking:#71DDC6}} зад него',
	},
	'caseStudySection.subtitle': {
		en: 'A glimpse into how we shape strategy, identity, and experience with intention',
		bg: 'Поглед към това как оформяме стратегия, идентичност и преживяване с намерение',
	},
};

export function getText(key: TranslationKey, language: Language): string {
	return translations[key][language];
}

// Helper function to parse colored text with format {{text:#HEX}}
export function parseColoredText(text: string): { text: string; coloredWords: { word: string; color: string }[] } {
	const colorPattern = /\{\{([^:]+):([^}]+)\}\}/g;
	const coloredWords: { word: string; color: string }[] = [];

	let match;
	let plainText = text;

	while ((match = colorPattern.exec(text)) !== null) {
		const [fullMatch, word, color] = match;
		coloredWords.push({ word, color });
		plainText = plainText.replace(fullMatch, word);
	}

	return { text: plainText, coloredWords };
}
