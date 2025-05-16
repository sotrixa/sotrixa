export type Language = 'en' | 'bg';

type TranslationKey = 'homeSection.title' | 'homeSection.paragraph' | 'homeSection.talkToUs' | 'homeSection.seeOurWork' | 'homeSection.researchSubheading' | 'introSection.title' | 'introSection.subheading' | 'introSection.testimonial';

export type Translations = {
	[key in TranslationKey]: {
		[lang in Language]: string;
	};
};

export const translations: Translations = {
	'homeSection.title': {
		en: 'We are a strategy lab for visionary thinkers.',
		bg: 'Ние сме стратегическа лаборатория за визионерски мислители.',
	},
	'homeSection.paragraph': {
		en: 'Through deep analysis and creative design, we shape strategic direction that moves ideas forward.',
		bg: 'Чрез задълбочен анализ и креативен дизайн, ние формираме стратегическа посока, която придвижва идеите напред.',
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
		en: 'Research should be too.',
		bg: 'Проучването също трябва да бъде.',
	},
	'introSection.title': {
		en: 'Every {{strategy:#D142E2}} has a {{rhythm:#71DEC6}}\n—ours begins by {{listening:#F4DD65}}.',
		bg: 'Всяка {{strategy:#D142E2}} има свой {{rhythm:#71DEC6}}\n—нашата започва със {{listening:#F4DD65}}.',
	},
	'introSection.subheading': {
		en: 'SOTRIXA in 60 seconds',
		bg: 'SOTRIXA за 60 секунди',
	},
	'introSection.testimonial': {
		en: "Each project becomes a living story, unfolding through research, structure, strategy, and design - shaping everything from your foundation to how you're seen and remembered.",
		bg: 'Всеки проект се превръща в жива история, разгръщаща се чрез изследване, структура, стратегия и дизайн - формираща всичко от вашата основа до това как сте възприемани и запомнени.',
	},
};

export function getText(key: TranslationKey, language: Language): string {
	return translations[key][language];
}
