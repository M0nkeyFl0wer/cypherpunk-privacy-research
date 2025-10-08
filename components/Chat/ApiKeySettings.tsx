'use client';

import { useState, useEffect } from 'react';
import { validateAnthropicKey } from '@/lib/ai/anthropicClient';
import {
  getStoredProvider,
  setStoredProvider,
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  type AIProvider,
} from '@/lib/ai/aiProvider';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderChange?: (provider: AIProvider) => void;
}

export default function ApiKeySettings({ isOpen, onClose, onProviderChange }: ApiKeySettingsProps) {
  const [provider, setProvider] = useState<AIProvider>('ollama');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load stored settings
    const storedProvider = getStoredProvider();
    const storedKey = getStoredApiKey();

    setProvider(storedProvider);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    setError('');
    setSuccess('');

    if (provider === 'anthropic') {
      if (!apiKey) {
        setError('API key is required for Anthropic provider');
        return;
      }

      if (!validateAnthropicKey(apiKey)) {
        setError('Invalid Anthropic API key format. Key must start with "sk-ant-"');
        return;
      }

      setStoredApiKey(apiKey);
    } else {
      // Clear API key when switching to Ollama
      if (getStoredApiKey()) {
        clearStoredApiKey();
      }
    }

    setStoredProvider(provider);
    setSuccess('Settings saved successfully!');

    // Notify parent component
    if (onProviderChange) {
      onProviderChange(provider);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClearKey = () => {
    setApiKey('');
    clearStoredApiKey();
    setSuccess('API key cleared');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-bg-darker border border-brand-bg-active rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-brand-text-primary">AI Settings</h2>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Provider Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-text-secondary mb-3">
            AI Provider
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProvider('ollama')}
              className={`p-4 rounded-lg border-2 transition-all ${
                provider === 'ollama'
                  ? 'border-brand-accent-green bg-brand-accent-green/10'
                  : 'border-brand-bg-active hover:border-brand-text-muted'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold text-brand-text-primary mb-1">
                  🤖 Ollama (Self-Hosted)
                </div>
                <div className="text-xs text-brand-text-muted">
                  Free, private, runs on Seshat server
                </div>
              </div>
            </button>

            <button
              onClick={() => setProvider('anthropic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                provider === 'anthropic'
                  ? 'border-brand-accent-purple bg-brand-accent-purple/10'
                  : 'border-brand-bg-active hover:border-brand-text-muted'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold text-brand-text-primary mb-1">
                  🔑 Anthropic Claude
                </div>
                <div className="text-xs text-brand-text-muted">
                  Bring your own API key
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Anthropic API Key Input */}
        {provider === 'anthropic' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 bg-brand-bg-dark border border-brand-bg-active rounded-lg text-brand-text-primary focus:outline-none focus:border-brand-accent-purple pr-20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary transition-colors"
              >
                {showKey ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-brand-text-muted">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent-purple hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mb-6 p-4 bg-brand-bg-dark rounded-lg border border-brand-bg-active">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-brand-text-secondary">
              {provider === 'ollama' ? (
                <>
                  <strong className="text-brand-text-primary">Ollama</strong> runs locally on the
                  Seshat server. No API keys needed, completely free and private.
                </>
              ) : (
                <>
                  <strong className="text-brand-text-primary">Your API key</strong> is stored
                  locally in your browser and never sent to our servers. All requests go directly
                  to Anthropic.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-brand-accent-purple hover:bg-brand-accent-purple/80 text-white rounded-lg transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
