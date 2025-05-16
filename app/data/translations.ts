export type Language = 'en' | 'bg';

type TranslationKey = 'homeSection.title' | 'homeSection.paragraph' | 'homeSection.talkToUs' | 'homeSection.seeOurWork' | 'homeSection.researchSubheading';

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
};

export function getText(key: TranslationKey, language: Language): string {
	return translations[key][language];
}
