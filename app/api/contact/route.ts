import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

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

		// Initialize Resend
		const resend = new Resend(process.env.RESEND_API_KEY);
		
		console.log('📧 Sending emails for contact form submission:');
		console.log('- From:', process.env.FROM_EMAIL);
		console.log('- To (notification):', process.env.TO_EMAIL);
		console.log('- To (response):', email);
		console.log('- Customer name:', name);

		// Send notification email to company
		const notificationResult = await resend.emails.send({
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

		if (notificationResult.error) {
			console.error('❌ Resend notification error:', notificationResult.error);
			return NextResponse.json({ success: false, error: 'Failed to send notification email' }, { status: 500 });
		}
		
		console.log('✅ Notification email sent successfully:', notificationResult.data?.id);

		// Send automated response email to customer
		const responseResult = await resend.emails.send({
			from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
			to: email, // Send to the customer's email
			subject: 'Thank you for reaching out!',
			html: `
				<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
					<div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
						<h2 style="color: #333; margin-bottom: 30px; font-size: 24px; font-weight: 300;">Dear ${name},</h2>
						
						<p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
							Thank you for reaching out — your message has found its way to us.
						</p>
						
						<p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
							We'll get back to you shortly with a response crafted especially for you.
						</p>
						
						<p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
							Wishing you a bright and inspiring day ahead!
						</p>
						
						<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
							<p style="color: #333; margin-bottom: 15px; font-size: 16px;">Kind regards,</p>
							<div style="margin-top: 10px;">
								<img src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/44444.png" alt="Petya Manchorova - Sotrixa Signature" style="max-width: 300px; height: auto; display: block;" />
							</div>
						</div>
					</div>
					
					<div style="text-align: center; margin-top: 20px;">
						<p style="color: #888; font-size: 12px;">
							This is an automated response. Please do not reply to this email.
						</p>
					</div>
				</div>
			`,
		});

		if (responseResult.error) {
			console.error('❌ Resend response error:', responseResult.error);
			// Don't fail the entire request if the response email fails
			// The notification email to the company is more critical
		} else {
			console.log('✅ Response email sent successfully:', responseResult.data?.id);
		}

		return NextResponse.json(
			{
				success: true,
				message: 'Emails sent successfully',
				notificationId: notificationResult.data?.id,
				responseId: responseResult.data?.id,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Contact form error:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
