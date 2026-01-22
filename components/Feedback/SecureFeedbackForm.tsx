'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  validateHoneypot,
  checkRateLimit,
  recordSubmission,
  sanitizeForUrl,
  checkSuspiciousPatterns,
  HONEYPOT_FIELDS,
  MIN_SUBMISSION_TIME,
} from '@/lib/security';

interface SecureFeedbackFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormData {
  type: string;
  title: string;
  description: string;
  // Honeypot fields - should stay empty
  [HONEYPOT_FIELDS.website]?: string;
  [HONEYPOT_FIELDS.phone]?: string;
}

export default function SecureFeedbackForm({ onSuccess, onError }: SecureFeedbackFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadTimestamp, setLoadTimestamp] = useState<number>(0);
  const [rateLimitInfo, setRateLimitInfo] = useState({ allowed: true, remainingAttempts: 3 });
  const formRef = useRef<HTMLFormElement>(null);

  // Set load timestamp on mount
  useEffect(() => {
    setLoadTimestamp(Date.now());
    setRateLimitInfo(checkRateLimit());
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // 1. Check rate limit
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        if (onError) onError('Too many submissions. Please wait a minute and try again.');
        setIsSubmitting(false);
        return;
      }

      // 2. Validate honeypot
      const honeypotCheck = validateHoneypot({
        honeypotWebsite: data[HONEYPOT_FIELDS.website],
        honeypotPhone: data[HONEYPOT_FIELDS.phone],
        loadTimestamp,
      });

      if (!honeypotCheck.valid) {
        // Don't tell bots why it failed - just show generic error
        console.warn('[Security] Submission blocked:', honeypotCheck.reason);
        // Fake success to confuse bots
        if (onSuccess) onSuccess();
        setIsSubmitting(false);
        return;
      }

      // 3. Check for suspicious patterns
      const suspiciousCheck = checkSuspiciousPatterns(data.description + ' ' + data.title);
      if (suspiciousCheck.suspicious) {
        console.warn('[Security] Suspicious patterns detected:', suspiciousCheck.flags);
        if (onError) onError('Your submission contains content that looks like spam. Please revise and try again.');
        setIsSubmitting(false);
        return;
      }

      // 4. Sanitize inputs
      const sanitizedTitle = sanitizeForUrl(data.title);
      const sanitizedDescription = sanitizeForUrl(data.description);
      const sanitizedType = sanitizeForUrl(data.type);

      // 5. Create GitHub issue URL with sanitized data
      const issueTitle = encodeURIComponent(`[${sanitizedType}] ${sanitizedTitle}`);
      const issueBody = encodeURIComponent(
        `## Type\n${sanitizedType}\n\n## Description\n${sanitizedDescription}\n\n---\n*Submitted via Web3Privacy Research feedback form*`
      );

      const githubUrl = `https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new?title=${issueTitle}&body=${issueBody}`;

      // 6. Record submission for rate limiting
      recordSubmission();
      setRateLimitInfo(checkRateLimit());

      // 7. Open in new tab
      window.open(githubUrl, '_blank');

      reset();
      // Reset timestamp for next submission
      setLoadTimestamp(Date.now());
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormReady = Date.now() - loadTimestamp >= MIN_SUBMISSION_TIME;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-[#111] rounded-lg p-6 border border-[#252525]"
    >
      {/* Rate limit warning */}
      {!rateLimitInfo.allowed && (
        <div className="p-4 bg-[#f9e2af]/10 border border-[#f9e2af]/30 rounded-lg">
          <p className="text-sm text-[#f9e2af]">
            You&apos;ve submitted too many times recently. Please wait a minute before trying again.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
          Feedback Type
        </label>
        <select
          {...register('type', { required: true })}
          className="w-full px-4 py-3 bg-[#252525] border border-[#1a1a1a] rounded-lg text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#94e2d5]"
        >
          <option value="Missing Project">Missing Project</option>
          <option value="Incorrect Data">Incorrect Data</option>
          <option value="Update Needed">Update Needed</option>
          <option value="Feature Request">Feature Request</option>
          <option value="General Feedback">General Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
          Title
        </label>
        <input
          {...register('title', { required: true, maxLength: 200 })}
          type="text"
          placeholder="Brief summary of your feedback"
          className="w-full px-4 py-3 bg-[#252525] border border-[#1a1a1a] rounded-lg text-[#e0e0e0] placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-[#94e2d5]"
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
          Description
        </label>
        <textarea
          {...register('description', { required: true, maxLength: 5000 })}
          rows={6}
          placeholder="Provide details about your feedback..."
          className="w-full px-4 py-3 bg-[#252525] border border-[#1a1a1a] rounded-lg text-[#e0e0e0] placeholder-[#6c7086] resize-none focus:outline-none focus:ring-2 focus:ring-[#94e2d5]"
          autoComplete="off"
        />
      </div>

      {/* Honeypot fields - hidden from users, visible to bots */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          height: 0,
          overflow: 'hidden',
        }}
      >
        <label htmlFor={HONEYPOT_FIELDS.website}>Website (leave blank)</label>
        <input
          {...register(HONEYPOT_FIELDS.website)}
          type="text"
          id={HONEYPOT_FIELDS.website}
          name={HONEYPOT_FIELDS.website}
          tabIndex={-1}
          autoComplete="off"
        />
        <label htmlFor={HONEYPOT_FIELDS.phone}>Phone (leave blank)</label>
        <input
          {...register(HONEYPOT_FIELDS.phone)}
          type="tel"
          id={HONEYPOT_FIELDS.phone}
          name={HONEYPOT_FIELDS.phone}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !rateLimitInfo.allowed || !isFormReady}
        className="w-full px-6 py-3 bg-[#94e2d5] text-[#000] rounded-lg font-medium hover:bg-[#74c7ba] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : !isFormReady ? 'Please wait...' : 'Submit Feedback'}
      </button>

      {rateLimitInfo.remainingAttempts < 3 && rateLimitInfo.allowed && (
        <p className="text-xs text-[#6c7086] text-center">
          {rateLimitInfo.remainingAttempts} submission{rateLimitInfo.remainingAttempts !== 1 ? 's' : ''} remaining
        </p>
      )}
    </form>
  );
}
