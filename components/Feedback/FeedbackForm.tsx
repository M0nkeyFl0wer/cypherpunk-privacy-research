'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormData {
  type: string;
  title: string;
  description: string;
}

export default function FeedbackForm({ onSuccess, onError }: FeedbackFormProps) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Create GitHub issue URL with pre-filled data
      const issueTitle = encodeURIComponent(`[${data.type}] ${data.title}`);
      const issueBody = encodeURIComponent(
        `## Type\n${data.type}\n\n## Description\n${data.description}\n\n---\n*Submitted via Web3Privacy Now feedback form*\n@M0nkeyFl0wer`
      );

      const githubUrl = `https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new?title=${issueTitle}&body=${issueBody}`;

      // Open in new tab
      window.open(githubUrl, '_blank');

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-brand-bg-darker rounded-lg p-6 border border-brand-bg-active">
      <div>
        <label className="block text-sm font-medium text-brand-text-primary mb-2">
          Feedback Type
        </label>
        <select
          {...register('type', { required: true })}
          className="w-full px-4 py-3 bg-brand-bg-active border border-brand-bg-hover rounded-lg text-brand-text-primary"
        >
          <option value="Missing Project">Missing Project</option>
          <option value="Incorrect Data">Incorrect Data</option>
          <option value="Update Needed">Update Needed</option>
          <option value="Feature Request">Feature Request</option>
          <option value="General Feedback">General Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-text-primary mb-2">
          Title
        </label>
        <input
          {...register('title', { required: true })}
          type="text"
          placeholder="Brief summary of your feedback"
          className="w-full px-4 py-3 bg-brand-bg-active border border-brand-bg-hover rounded-lg text-brand-text-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-text-primary mb-2">
          Description
        </label>
        <textarea
          {...register('description', { required: true })}
          rows={6}
          placeholder="Provide details about your feedback..."
          className="w-full px-4 py-3 bg-brand-bg-active border border-brand-bg-hover rounded-lg text-brand-text-primary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-brand-accent-purple text-white rounded-lg font-medium hover:bg-brand-accent-purple-hover disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
