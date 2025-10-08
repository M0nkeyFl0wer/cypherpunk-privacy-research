import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  projects?: any[];
  timestamp: Date;
}

export default function ChatMessage({ role, content, projects, timestamp }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent-purple flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className={`flex-1 max-w-3xl ${!isAssistant && 'flex justify-end'}`}>
        <div className={`px-6 py-4 rounded-lg ${
          isAssistant
            ? 'bg-brand-bg-darker border border-brand-bg-active'
            : 'bg-brand-accent-purple text-white'
        }`}>
          <div className={`prose prose-sm max-w-none ${
            isAssistant ? 'prose-invert' : 'prose-invert'
          }`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {/* Show related project cards if available */}
          {projects && projects.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/project/${project.slug}`}
                  className="block p-3 rounded-lg bg-brand-bg-active hover:bg-brand-bg-hover border border-brand-bg-active transition-all"
                >
                  <h4 className="font-semibold text-brand-text-primary text-sm mb-1">
                    {project.name}
                  </h4>
                  <p className="text-xs text-brand-text-secondary line-clamp-2">
                    {project.privacyTechniques?.slice(0, 3).join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-brand-text-muted ${!isAssistant && 'text-right'}`}>
          {timestamp.toLocaleTimeString()}
        </div>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent-blue flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
