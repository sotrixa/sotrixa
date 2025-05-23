import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const ContactFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	email: z.string().email('Invalid email address'),
	subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
	message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate the form data
		const validationResult = ContactFormSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error: 'Validation failed',
					details: validationResult.error.errors,
				},
				{ status: 400 }
			);
		}

		const { name, email, subject, message } = validationResult.data;

		// Check if Resend API key is configured
		if (!process.env.RESEND_API_KEY) {
			console.error('RESEND_API_KEY is not configured');
			return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 });
		}

		// Send email using Resend
		const emailResult = await resend.emails.send({
			from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
			to: process.env.TO_EMAIL || 'hello@company.com',
			subject: `New Contact Form Submission: ${subject}`,
			html: `
				<h2>New Contact Form Submission</h2>
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
						<h3 style="margin: 0 0 15px 0; color: #333;">Contact Details</h3>
						<p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
						<p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
						<p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
					</div>
					
					<div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
						<h4 style="margin: 0 0 15px 0; color: #333;">Message:</h4>
						<p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
					</div>
					
					<div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
						<p style="margin: 0; font-size: 14px; color: #666;">
							This email was sent from your website contact form.
						</p>
					</div>
				</div>
			`,
		});

		if (emailResult.error) {
			console.error('Resend error:', emailResult.error);
			return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
		}

		return NextResponse.json(
			{
				success: true,
				message: 'Email sent successfully',
				id: emailResult.data?.id,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Contact form error:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
