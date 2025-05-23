# Email Setup with Resend

This project uses [Resend](https://resend.com) for handling contact form submissions. Follow these steps to set up email functionality:

## 1. Get a Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the [API Keys section](https://resend.com/api-keys)
3. Create a new API key with the appropriate permissions
4. Copy your API key

## 2. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
FROM_EMAIL=onboarding@resend.dev
TO_EMAIL=your-email@company.com
```

### Environment Variables Explained:

- `RESEND_API_KEY`: Your Resend API key
- `FROM_EMAIL`: The email address that will appear as the sender (must be verified in Resend)
- `TO_EMAIL`: The email address where contact form submissions will be sent

## 3. Domain Verification (Recommended)

For production use, you should verify your domain in Resend:

1. Go to [Domains](https://resend.com/domains) in your Resend dashboard
2. Add your domain
3. Follow the DNS configuration instructions
4. Update `FROM_EMAIL` to use your verified domain (e.g., `contact@yourdomain.com`)

## 4. Testing

1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email for the contact form submission

## 5. Form Features

The contact form includes:

- ✅ Real-time form validation using Zod
- ✅ Loading states and user feedback
- ✅ Error handling and retry functionality
- ✅ Success/error message display
- ✅ Form reset after successful submission
- ✅ Responsive design
- ✅ Accessibility features

## 6. Email Template

The email includes:

- Contact details (name, email, subject)
- Formatted message content
- Professional HTML styling
- Clear indication it came from your website

## 7. Security Notes

- Never commit your `.env.local` file to version control
- The API route validates all input data
- Rate limiting should be added for production use
- Consider adding CAPTCHA for additional spam protection

## Troubleshooting

### Common Issues:

1. **"Email service not configured" error**: Make sure `RESEND_API_KEY` is set in your environment variables

2. **"Failed to send email" error**: Check that your API key is valid and has the necessary permissions

3. **Emails not being received**:

   - Check your spam folder
   - Verify the `TO_EMAIL` address is correct
   - Ensure your domain is verified (for custom FROM_EMAIL addresses)

4. **Form validation errors**: The form validates:
   - Name: 1-100 characters
   - Email: Valid email format
   - Subject: 1-200 characters
   - Message: 1-1000 characters

### Development vs Production:

- **Development**: You can use `onboarding@resend.dev` as the FROM_EMAIL
- **Production**: Verify your domain and use your own email address

For more information, visit the [Resend documentation](https://resend.com/docs).
