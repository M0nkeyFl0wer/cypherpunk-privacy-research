'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = 'Type your message...' }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
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
    <div className="fixed bottom-0 left-0 right-0 bg-brand-bg-darker border-t border-brand-bg-active">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 px-4 py-3 bg-brand-bg-active border border-brand-bg-hover rounded-lg
                     text-brand-text-primary placeholder-brand-text-muted
                     focus:outline-none focus:ring-2 focus:ring-brand-accent-purple focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none min-h-[48px] max-h-[120px]"
            style={{
              height: 'auto',
              minHeight: '48px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />

          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="px-6 py-3 bg-brand-accent-purple text-white rounded-lg font-medium
                     hover:bg-brand-accent-purple-hover active:bg-brand-accent-purple-active
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200
                     flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
