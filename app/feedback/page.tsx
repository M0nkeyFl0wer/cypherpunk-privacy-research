'use client';

import { useState } from 'react';
import SecureFeedbackForm from '@/components/Feedback/SecureFeedbackForm';
import ObfuscatedEmail from '@/components/ObfuscatedEmail';

export default function FeedbackPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSuccess = () => {
    setShowSuccess(true);
    setShowError(false);
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Auto-hide after 10 seconds
    setTimeout(() => setShowSuccess(false), 10000);
  };

  const handleError = (error: string) => {
    setShowError(true);
    setShowSuccess(false);
    setErrorMessage(error);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#e0e0e0] mb-4">
            Submit Feedback
          </h1>
          <p className="text-lg text-[#a6adc8]">
            Help us improve the Web3 Privacy research database. Your contributions make this resource better for everyone.
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-8 p-6 bg-[#a6e3a1]/10 border border-[#a6e3a1]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#a6e3a1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-[#a6e3a1] mb-2">
                  Feedback prepared successfully!
                </h3>
                <p className="text-[#a6e3a1]/90 mb-3">
                  A GitHub issue form has opened in a new tab with your information pre-filled. Click &quot;Submit new issue&quot; on GitHub to complete your submission.
                </p>
                <p className="text-[#a6e3a1]/70 text-sm mb-3">
                  If the tab didn&apos;t open, please check your popup blocker or click the link below.
                </p>
                <a
                  href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#a6e3a1] hover:text-[#a6e3a1]/80 font-medium transition-colors"
                >
                  <span>Open GitHub Issues</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {showError && (
          <div className="mb-8 p-6 bg-[#f38ba8]/10 border border-[#f38ba8]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#f38ba8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-[#f38ba8] mb-2">
                  Submission failed
                </h3>
                <p className="text-[#f38ba8]/90 mb-3">
                  {errorMessage || 'An error occurred while submitting your feedback. Please try again.'}
                </p>
                <p className="text-[#f38ba8]/70 text-sm">
                  If the problem persists, please create an issue directly on{' '}
                  <a
                    href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#f38ba8]/80"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-10 p-8 bg-[#111] border border-[#252525] rounded-lg">
          <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-6">
            Submission Guidelines
          </h2>

          <div className="space-y-6">
            {/* Missing Project */}
            <div>
              <h3 className="text-lg font-semibold text-[#94e2d5] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Missing Project
              </h3>
              <p className="text-[#a6adc8] mb-3">
                Report a Web3 privacy project that's not in our database.
              </p>
              <div className="pl-4 border-l-2 border-[#252525]">
                <p className="text-sm text-[#6c7086] mb-2">
                  <strong>Good example:</strong>
                </p>
                <p className="text-sm text-[#a6adc8] italic">
                  "Aztec Network - aztec.network - A privacy-first zkRollup L2 for Ethereum. Uses zero-knowledge proofs for private smart contracts. Launched in 2020, based in London. Highly relevant as it provides programmable privacy."
                </p>
              </div>
            </div>

            {/* Incorrect Data */}
            <div>
              <h3 className="text-lg font-semibold text-[#89b4fa] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Incorrect Data
              </h3>
              <p className="text-[#a6adc8] mb-3">
                Report inaccurate information about a project.
              </p>
              <div className="pl-4 border-l-2 border-[#252525]">
                <p className="text-sm text-[#6c7086] mb-2">
                  <strong>Good example:</strong>
                </p>
                <p className="text-sm text-[#a6adc8] italic">
                  "Project: tornado-cash - Field: status - Currently shows 'active' but should be 'discontinued' - Evidence: Project shut down in August 2022 after OFAC sanctions. See: https://..."
                </p>
              </div>
            </div>

            {/* Update Needed */}
            <div>
              <h3 className="text-lg font-semibold text-[#a6e3a1] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Needed
              </h3>
              <p className="text-[#a6adc8] mb-3">
                Report outdated information that needs updating.
              </p>
              <div className="pl-4 border-l-2 border-[#252525]">
                <p className="text-sm text-[#6c7086] mb-2">
                  <strong>Good example:</strong>
                </p>
                <p className="text-sm text-[#a6adc8] italic">
                  "Project: nym - What changed: Launched mainnet and updated website - Evidence: Announcement on their blog dated January 2025: https://..."
                </p>
              </div>
            </div>

            {/* Feature Request */}
            <div>
              <h3 className="text-lg font-semibold text-[#f9e2af] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Feature Request
              </h3>
              <p className="text-[#a6adc8] mb-3">
                Suggest new features or improvements to the site.
              </p>
              <div className="pl-4 border-l-2 border-[#252525]">
                <p className="text-sm text-[#6c7086] mb-2">
                  <strong>Good example:</strong>
                </p>
                <p className="text-sm text-[#a6adc8] italic">
                  "Add a comparison view that lets users compare privacy techniques side-by-side for multiple projects. This would help users choose the right privacy solution for their needs."
                </p>
              </div>
            </div>

            {/* General Feedback */}
            <div>
              <h3 className="text-lg font-semibold text-[#cba6f7] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                General Feedback
              </h3>
              <p className="text-[#a6adc8] mb-3">
                Share general comments, questions, or suggestions.
              </p>
              <div className="pl-4 border-l-2 border-[#252525]">
                <p className="text-sm text-[#6c7086] mb-2">
                  <strong>Good example:</strong>
                </p>
                <p className="text-sm text-[#a6adc8] italic">
                  "The search feature is great, but it would be helpful if it highlighted matching terms in the results. Also, the mobile experience could be improved for the visualizations page."
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#000] rounded border border-[#252525]">
            <p className="text-sm text-[#6c7086]">
              <strong className="text-[#a6adc8]">Note:</strong> All feedback is publicly visible as GitHub issues. Please don't include sensitive information. Submissions are automatically tagged with{' '}
              <code className="px-1.5 py-0.5 bg-[#252525] text-[#94e2d5] rounded text-xs">@M0nkeyFl0wer</code>
              {' '}for review.
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <SecureFeedbackForm onSuccess={handleSuccess} onError={handleError} />

        {/* Email Alternative - For Non-Technical Users */}
        <div className="mt-10 p-6 bg-[#0d1117] border border-[#89b4fa]/30 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#89b4fa]/10 rounded-lg">
              <svg className="w-6 h-6 text-[#89b4fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">
                Prefer Email?
              </h3>
              <p className="text-[#a6adc8] mb-4">
                No GitHub account? No problem. Send corrections, updates, or new project suggestions directly via email. Just describe what needs to change in plain text.
              </p>
              <ObfuscatedEmail
                user="web3privacy"
                domain="benwest.io"
                subject="Web3 Privacy Research Feedback"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#89b4fa] text-[#000] font-medium rounded-lg hover:bg-[#89b4fa]/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send Email</span>
              </ObfuscatedEmail>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-10 pt-8 border-t border-[#252525]">
          <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4">
            Other Ways to Contribute
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#111] border border-[#252525] rounded-lg hover:border-[#94e2d5] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#94e2d5]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-[#e0e0e0] group-hover:text-[#94e2d5] transition-colors">
                  Browse Repository
                </h4>
              </div>
              <p className="text-sm text-[#a6adc8]">
                View the source code, contribute via pull requests, or explore the research data.
              </p>
            </a>

            <a
              href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#111] border border-[#252525] rounded-lg hover:border-[#94e2d5] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#94e2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h4 className="font-semibold text-[#e0e0e0] group-hover:text-[#94e2d5] transition-colors">
                  View All Issues
                </h4>
              </div>
              <p className="text-sm text-[#a6adc8]">
                See what others have reported and track the status of your submissions.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
