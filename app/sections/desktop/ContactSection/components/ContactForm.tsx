import React from 'react';
import { formContainerStyles, formItemWrapperStyles, labelStyles, inputStyles, textareaStyles, buttonStyles } from '../utils/formStyles';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  formItemsRef: React.MutableRefObject<HTMLDivElement[]>;
  animationsCreated: boolean;
  formData: ContactFormData;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ContactForm({
  formRef,
  formItemsRef,
  animationsCreated,
  formData,
  isSubmitting,
  isSuccess,
  error,
  handleInputChange,
  handleSubmit,
}: ContactFormProps) {
  // Add element to formItemsRef array
  const addToFormRefs = (el: HTMLDivElement | null) => {
    if (el && !formItemsRef.current.includes(el)) {
      formItemsRef.current.push(el);
    }
  };

  return (
    <div ref={formRef} style={{ opacity: animationsCreated ? undefined : 1 }}>
      {/* Success Message */}
      {isSuccess && (
        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-800 text-sm font-medium'>✓ Message sent successfully!</p>
          <p className='text-green-600 text-xs mt-1'>We&apos;ll get back to you soon.</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-800 text-sm font-medium'>⚠ {error}</p>
          <p className='text-red-600 text-xs mt-1'>Please try again or contact us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-2 sm:space-y-2.5 contact-form-override' style={formContainerStyles}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5'>
          <div ref={addToFormRefs} style={formItemWrapperStyles(animationsCreated)}>
            <label htmlFor='name' className='block mb-1 text-xs font-medium text-gray-700' style={labelStyles}>
              Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm'
              placeholder='John Doe'
              required
              disabled={isSubmitting}
              style={inputStyles}
            />
          </div>

          <div ref={addToFormRefs} style={formItemWrapperStyles(animationsCreated)}>
            <label htmlFor='email' className='block mb-1 text-xs font-medium text-gray-700' style={labelStyles}>
              Email *
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm'
              placeholder='john@example.com'
              required
              disabled={isSubmitting}
              style={inputStyles}
            />
          </div>
        </div>

        <div ref={addToFormRefs} style={formItemWrapperStyles(animationsCreated)}>
          <label htmlFor='subject' className='block mb-1 text-xs font-medium text-gray-700' style={labelStyles}>
            Subject *
          </label>
          <input
            type='text'
            id='subject'
            name='subject'
            value={formData.subject}
            onChange={handleInputChange}
            className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm'
            placeholder='Project inquiry'
            required
            disabled={isSubmitting}
            style={inputStyles}
          />
        </div>

        <div ref={addToFormRefs} style={formItemWrapperStyles(animationsCreated)}>
          <label htmlFor='message' className='block mb-1 text-xs font-medium text-gray-700' style={labelStyles}>
            Message *
          </label>
          <textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className='w-full px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors text-gray-800 text-sm resize-none'
            placeholder='Tell us about your project...'
            required
            disabled={isSubmitting}
            style={textareaStyles}
          ></textarea>
        </div>

        <div ref={addToFormRefs} style={{ ...formItemWrapperStyles(animationsCreated), userSelect: undefined }}>
          <button type='submit' disabled={isSubmitting} className='px-4 sm:px-5 py-1.5 sm:py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2' style={buttonStyles}>
            {isSubmitting ? (
              <>
                <div className='w-3 h-3 border border-white border-t-transparent rounded-full animate-spin'></div>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
