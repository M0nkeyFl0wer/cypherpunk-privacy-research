'use client';

import { useState, useEffect } from 'react';
import {
  getStoredProvider,
  setStoredProvider,
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  type AIProvider
} from '@/lib/ai/aiProvider';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderChange?: (provider: AIProvider) => void;
}

function validateAnthropicKey(key: string): boolean {
  return key.startsWith('sk-ant-') && key.length > 20;
}

export default function ApiKeySettings({ isOpen, onClose, onProviderChange }: ApiKeySettingsProps) {
  const [provider, setProvider] = useState<AIProvider>('ollama');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedProvider = getStoredProvider();
      const storedKey = getStoredApiKey();
      setProvider(storedProvider);
      setApiKey(storedKey || '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    setError('');

    // Validate Anthropic key if using Anthropic
    if (provider === 'anthropic') {
      if (!validateAnthropicKey(apiKey)) {
        setError('Invalid Anthropic API key format. Key should start with "sk-ant-"');
        return;
      }
      setStoredApiKey(apiKey);
    } else {
      // Clear API key if switching to Ollama
      clearStoredApiKey();
    }

    setStoredProvider(provider);
    setSuccess(true);

    if (onProviderChange) {
      onProviderChange(provider);
    }

    // Close modal after a brief success message
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#111] rounded-xl shadow-2xl max-w-2xl w-full border border-[#252525]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#252525]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#e0e0e0]">AI Settings</h2>
              <button
                onClick={onClose}
                className="text-[#6c7086] hover:text-[#e0e0e0] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Provider Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">
                Choose AI Provider
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ollama Card */}
                <button
                  onClick={() => setProvider('ollama')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    provider === 'ollama'
                      ? 'border-[#94e2d5] bg-[#94e2d5]/10'
                      : 'border-[#252525] hover:border-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      provider === 'ollama' ? 'bg-[#94e2d5]' : 'bg-[#252525]'
                    }`}>
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#e0e0e0]">Ollama</h4>
                      <p className="text-sm text-[#a6adc8] mt-1">
                        Free, self-hosted AI on Seshat
                      </p>
                    </div>
                  </div>
                </button>

                {/* Anthropic Card */}
                <button
                  onClick={() => setProvider('anthropic')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    provider === 'anthropic'
                      ? 'border-[#94e2d5] bg-[#94e2d5]/10'
                      : 'border-[#252525] hover:border-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      provider === 'anthropic' ? 'bg-[#94e2d5]' : 'bg-[#252525]'
                    }`}>
                      <span className="text-2xl">🔑</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#e0e0e0]">Anthropic Claude</h4>
                      <p className="text-sm text-[#a6adc8] mt-1">
                        Bring your own API key
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* API Key Input (only shown for Anthropic) */}
            {provider === 'anthropic' && (
              <div>
                <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">
                  Anthropic API Key
                </h3>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setError('');
                      }}
                      placeholder="sk-ant-api03-..."
                      className="w-full px-4 py-3 bg-[#252525] border border-[#1a1a1a] rounded-lg
                               text-[#e0e0e0] placeholder-[#6c7086]
                               focus:outline-none focus:ring-2 focus:ring-[#94e2d5] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-[#e0e0e0]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showKey ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs text-[#6c7086]">
                    Your API key is stored locally in your browser and never sent to our servers.
                    Get your key from{' '}
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#94e2d5] hover:underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>

                  {apiKey && (
                    <button
                      onClick={handleClear}
                      className="text-sm text-[#6c7086] hover:text-[#f38ba8] transition-colors"
                    >
                      Clear saved key
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Ollama Info */}
            {provider === 'ollama' && (
              <div className="p-4 rounded-lg bg-[#252525] border border-[#1a1a1a]">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#89b4fa] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-[#e0e0e0]">Self-Hosted AI</h4>
                    <p className="text-sm text-[#a6adc8] mt-1">
                      Ollama runs on the Seshat server (seshat.noosworx.com) with the Llama 3.1 8B model.
                      No API key needed - completely free and private.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-[#f38ba8]/10 border border-[#f38ba8]/50">
                <p className="text-sm text-[#f38ba8]">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-[#a6e3a1]/10 border border-[#a6e3a1]/50">
                <p className="text-sm text-[#a6e3a1]">Settings saved successfully!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#252525] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#a6adc8] hover:text-[#e0e0e0] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#94e2d5] text-[#000] rounded-lg font-medium
                       hover:bg-[#74c7ba] active:bg-[#5cb3a6]
                       transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
