'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask about Web3 privacy projects...',
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-brand-bg-dark border-t border-brand-bg-active p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-3 bg-brand-bg-darker border border-brand-bg-active text-brand-text-primary placeholder-brand-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent-purple focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="flex-shrink-0 px-6 py-3 bg-brand-accent-purple text-white font-medium rounded-lg hover:bg-brand-accent-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-accent-purple"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-brand-text-muted mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-brand-bg-active rounded text-brand-text-secondary">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-brand-bg-active rounded text-brand-text-secondary">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
