'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ChatMessage from '@/components/Chat/ChatMessage';
import ChatInput from '@/components/Chat/ChatInput';
import QuickActions from '@/components/Chat/QuickActions';
import ApiKeySettings from '@/components/Chat/ApiKeySettings';
import { getExampleQueries } from '@/lib/ai/queryProcessor';
import { chat, getStoredProvider, getStoredApiKey, type AIProvider, type AIMessage } from '@/lib/ai/aiProvider';
import { getAllProjectSummaries } from '@/lib/data/client-data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  projects?: any[];
  timestamp: Date;
}

export default function ChatPage() {
  const [provider, setProvider] = useState<AIProvider>('ollama');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to the **Web3Privacy AI Assistant**! 🔒

I can help you explore our research on **134 Web3 privacy projects**. Ask me anything about:

• Privacy techniques (Zero-Knowledge, mixing, encryption)
• Technology stacks (Rust, Solidity, TypeScript)
• Project categories (DeFi, wallets, communication)
• Research quality and recommendations

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load stored provider and API key on mount
    const storedProvider = getStoredProvider();
    const storedKey = getStoredApiKey();
    setProvider(storedProvider);
    setApiKey(storedKey);
  }, []);

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setStreamingMessage('');

    try {
      // Get project data for context
      const projects = await getAllProjectSummaries();

      // Build context for Ollama (limit to 30 projects to avoid token limits)
      const projectContext = projects
        .slice(0, 30)
        .map(p => `${p.name}: ${p.category}, Privacy: ${p.privacyTechniques.join(', ')}`)
        .join('\n');

      // Build conversation history
      const systemPrompt: AIMessage = {
        role: 'system',
        content: `You are an AI assistant helping users explore Web3 privacy projects. You have access to research data on 134 projects focused on privacy, security, and anonymity.

Available Projects (sample):
${projectContext}

When users ask about privacy projects:
- Search through available data and provide relevant recommendations
- Include specific project names and their key privacy features
- Explain privacy techniques (Zero-Knowledge Proofs, mixing, encryption, etc.)
- Suggest projects based on their needs (DeFi privacy, private messaging, etc.)
- Keep responses concise and focused on actionable insights
- If asked about specific projects not in the sample, acknowledge you may have incomplete data

Be helpful, accurate, and privacy-focused.`,
      };

      // Add user message to conversation history
      const userPrompt: AIMessage = {
        role: 'user',
        content: input,
      };

      // Include recent conversation history (last 4 messages)
      const recentHistory = conversationHistory.slice(-4);
      const chatMessages: AIMessage[] = [
        systemPrompt,
        ...recentHistory,
        userPrompt,
      ];

      // Call AI provider with streaming
      let responseText = '';
      await chat(
        chatMessages,
        provider,
        apiKey || undefined,
        (chunk) => {
          responseText += chunk;
          setStreamingMessage(responseText);
        }
      );

      // Find relevant projects based on response
      const lowerResponse = responseText.toLowerCase();
      const relevantProjects = projects.filter(p =>
        lowerResponse.includes(p.name.toLowerCase()) ||
        p.privacyTechniques.some(tech =>
          lowerResponse.includes(tech.toLowerCase())
        ) ||
        (p.category && lowerResponse.includes(p.category.toLowerCase()))
      );

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        projects: relevantProjects.slice(0, 6),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: responseText },
      ]);

    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: provider === 'ollama'
          ? 'Sorry, I encountered an error connecting to the Ollama server. Please check that Ollama is running on Seshat.\n\nError: ' + (error as Error).message
          : 'Sorry, I encountered an error with the Anthropic API. Please check your API key in settings.\n\nError: ' + (error as Error).message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setStreamingMessage('');
    }
  };

  const exampleQueries = getExampleQueries();

  return (
    <div className="min-h-screen bg-brand-bg-dark flex flex-col">
      {/* Header */}
      <header className="bg-brand-bg-darker border-b border-brand-bg-active sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-3">
                <img src="/brand/logo-white.svg" alt="Web3Privacy Now" className="h-10 w-auto" />
                AI Assistant
              </h1>
              <p className="mt-1 text-sm text-brand-text-secondary">
                Ask questions about Web3 privacy projects
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent-blue transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent-purple transition-colors"
              >
                Search
              </Link>
              <Link
                href="/visualizations"
                className="text-sm font-medium text-brand-text-secondary hover:text-brand-accent-green transition-colors"
              >
                Visualizations
              </Link>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-text-secondary hover:text-brand-accent-purple hover:bg-brand-bg-active rounded-lg transition-colors"
                title="AI Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions (shown initially) */}
          {messages.length === 1 && (
            <div className="mb-8">
              <QuickActions
                suggestions={exampleQueries}
                onSelect={handleSendMessage}
              />
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                projects={message.projects}
                timestamp={message.timestamp}
              />
            ))}

            {isProcessing && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent-purple flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 max-w-3xl">
                  {streamingMessage ? (
                    <div className="px-6 py-4 rounded-lg bg-brand-bg-darker border border-brand-bg-active">
                      <div className="text-brand-text-primary whitespace-pre-wrap">
                        {streamingMessage}
                        <span className="inline-block w-2 h-4 ml-1 bg-brand-accent-purple animate-pulse"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-block px-6 py-4 rounded-lg bg-brand-bg-darker border border-brand-bg-active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-accent-purple rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-brand-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-brand-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <span className="text-sm text-brand-text-muted ml-2">Connecting to AI...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Spacer for input */}
          <div className="h-32" />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing}
        placeholder="Ask about privacy projects, techniques, or recommendations..."
      />

      {/* Info Banner */}
      <div className="bg-brand-bg-darker border-t border-brand-bg-active">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-brand-text-muted text-center">
            {provider === 'ollama' ? (
              <>
                🤖 Powered by <strong>Ollama</strong> (self-hosted AI on Seshat) • Free, private, and aligned with Web3 privacy values
              </>
            ) : (
              <>
                🔑 Using <strong>Anthropic Claude</strong> with your API key • All requests go directly to Anthropic
              </>
            )}
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <ApiKeySettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onProviderChange={(newProvider) => {
          setProvider(newProvider);
          setApiKey(getStoredApiKey());
        }}
      />
    </div>
  );
}
