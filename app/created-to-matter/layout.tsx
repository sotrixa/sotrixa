import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Created to Matter | Sotrixa',
	description: 'Empowering bold ideas with strategies that align vision, purpose, and growth.',
};

export default function CreatedToMatterLayout({ children }: { children: React.ReactNode }) {
	return children;
}
