import React, { FormEvent, useEffect, useRef } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabaseQuery } from '../lib/supabase-enhanced';
import { supabase } from '../lib/supabase';
import { useFormValidation } from '../hooks/use-form-validation';
import { useToast } from './ToastContainer';
import { createAppError } from '../types/errors';
import { logError } from '../utils/error-logger';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'strategy' | 'pilot';
}

export default function ContactModal({ isOpen, onClose, type }: ContactModalProps) {
  const { showSuccess, showError } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const { formState, getFieldProps, validateForm, resetForm, getNormalizedValues } = useFormValidation({
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    company: { required: true, minLength: 2, maxLength: 100 },
    businessType: { required: true },
    phone: { required: true, phone: true },
    message: { maxLength: 1000 },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedValues = getNormalizedValues();

      const { error } = await supabaseQuery(
        async () => {
          const result = await supabase.from('leads').insert([{
            name: normalizedValues.name,
            email: normalizedValues.email,
            company: normalizedValues.company,
            business_type: normalizedValues.businessType,
            phone: normalizedValues.phone,
            message: normalizedValues.message,
            submission_type: type,
          }]);
          return result;
        }
      );

      if (error) {
        showError(error);
        const appError = createAppError(new Error(error));
        logError(appError, { form: 'contact_modal', type });
        return;
      }

      setSubmitted(true);
      showSuccess('Form submitted successfully! We\'ll be in touch within 24 hours.');

      setTimeout(() => {
        onClose();
        setSubmitted(false);
        resetForm();
      }, 2500);
    } catch (err) {
      const appError = createAppError(err);
      showError(appError.userMessage);
      logError(appError, { form: 'contact_modal', type });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 flex items-center justify-between z-10">
          <div>
            <h3 id="modal-title" className="text-2xl font-bold text-white">
              {type === 'strategy' ? 'Book Strategy Session' : 'Join Pilot Program'}
            </h3>
            <p className="text-cyan-50 text-sm mt-1">
              {type === 'strategy'
                ? 'Get your custom operational profit analysis'
                : 'Apply for early access with pilot pricing'}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" aria-hidden="true" />
          </button>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h4>
              <p className="text-slate-600 dark:text-slate-300">
                We'll be in touch within 24 hours to schedule your session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    id="name"
                    {...getFieldProps('name')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      formState.name.error && formState.name.touched
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="John Smith"
                    aria-invalid={formState.name.error && formState.name.touched ? 'true' : 'false'}
                    aria-describedby={formState.name.error && formState.name.touched ? 'name-error' : undefined}
                  />
                  {formState.name.error && formState.name.touched && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      {formState.name.error}
                    </p>
                  )}
                  {!formState.name.error && formState.name.dirty && formState.name.value.trim().length >= 2 && (
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Looks good
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...getFieldProps('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      formState.email.error && formState.email.touched
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="john@company.com"
                    aria-invalid={formState.email.error && formState.email.touched ? 'true' : 'false'}
                    aria-describedby={formState.email.error && formState.email.touched ? 'email-error' : undefined}
                  />
                  {formState.email.error && formState.email.touched && (
                    <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      {formState.email.error}
                    </p>
                  )}
                  {!formState.email.error && formState.email.dirty && formState.email.value.includes('@') && (
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Valid email
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...getFieldProps('company')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      formState.company.error && formState.company.touched
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Your Company"
                    aria-invalid={formState.company.error && formState.company.touched ? 'true' : 'false'}
                    aria-describedby={formState.company.error && formState.company.touched ? 'company-error' : undefined}
                  />
                  {formState.company.error && formState.company.touched && (
                    <p id="company-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      {formState.company.error}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    {...getFieldProps('businessType')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      formState.businessType.error && formState.businessType.touched
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    aria-invalid={formState.businessType.error && formState.businessType.touched ? 'true' : 'false'}
                    aria-describedby={formState.businessType.error && formState.businessType.touched ? 'businessType-error' : undefined}
                  >
                    <option value="">Select type</option>
                    <option value="restaurant">Restaurant (5-50 locations)</option>
                    <option value="fleet">Fleet Operator (25-75 vehicles)</option>
                    <option value="other">Other</option>
                  </select>
                  {formState.businessType.error && formState.businessType.touched && (
                    <p id="businessType-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      {formState.businessType.error}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...getFieldProps('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    formState.phone.error && formState.phone.touched
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  placeholder="(555) 123-4567"
                  aria-invalid={formState.phone.error && formState.phone.touched ? 'true' : 'false'}
                  aria-describedby={formState.phone.error && formState.phone.touched ? 'phone-error' : undefined}
                />
                {formState.phone.error && formState.phone.touched && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {formState.phone.error}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Tell us about your biggest operational challenge
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...getFieldProps('message')}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="What's costing you the most money or time right now?"
                />
                {formState.message.value && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formState.message.value.length} / 1000 characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" aria-hidden="true" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
