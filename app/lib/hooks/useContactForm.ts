import { useState } from 'react';

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

interface UseContactFormReturn {
	formData: ContactFormData;
	isSubmitting: boolean;
	isSuccess: boolean;
	error: string | null;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	resetForm: () => void;
}

export const useContactForm = (): UseContactFormReturn => {
	const [formData, setFormData] = useState<ContactFormData>({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (error) setError(null);
		// Clear success when user starts editing
		if (isSuccess) setIsSuccess(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setIsSuccess(false);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to send message');
			}

			setIsSuccess(true);
			setFormData({
				name: '',
				email: '',
				subject: '',
				message: '',
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			subject: '',
			message: '',
		});
		setError(null);
		setIsSuccess(false);
		setIsSubmitting(false);
	};

	return {
		formData,
		isSubmitting,
		isSuccess,
		error,
		handleInputChange,
		handleSubmit,
		resetForm,
	};
};
