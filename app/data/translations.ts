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
		en: 'Every {{strategy:#53EBDD}} has a {{rhythm:#DD53EB}}\n—ours begins by {{listening:#EBDD53}}',
		bg: 'Всяка {{strategy:#53EBDD}} има свой {{rhythm:#DD53EB}}\n—нашата започва със {{listening:#EBDD53}}',
	},
	'introSection.subheading': {
		en: 'See how it unfolds',
		bg: 'SOTRIXA за 60 секунди',
	},
	'introSection.testimonial': {
		en: "The Lab by SOTRIXA",
		bg: 'Всеки проект се превръща в жива история, разгръщаща се чрез изследване, структура, стратегия и дизайн — формираща всичко от вашата основа до това как сте възприемани и запомнени.',
	},
	'servicesSection.title': {
		en: 'The way we work is {{layered:#EBDD53}}, {{intentional:#DD53EB}}, and deeply {{aligned:#53EBDD}}',
		bg: 'Начинът, по който работим, е {{layered:#EBDD53}}, {{intentional:#DD53EB}} и дълбоко {{aligned:#53EBDD}}.',
	},
	'servicesSection.subtitle': {
		en: 'We move from insight to structure, strategy to story — building identities and experiences that hold together and move forward.',
		bg: 'Преминаваме от прозрение към структура, от стратегия към история—изграждайки идентичности и преживявания, които се свързват и вървят напред.',
	},
	'caseStudySection.title': {
		en: 'We {{build:#EBDD53}} with {{purpose:#DD53EB}}—and every outcome reflects the `{{thinking:#53EBDD}} behind it',
		bg: 'Ние {{build:#EBDD53}} с {{purpose:#DD53EB}}—и всеки резултат отразява {{thinking:#53EBDD}} зад него',
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
