'use client';

import Link from 'next/link';
import type { ProjectSummary } from '@/lib/data/client-data';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  projects?: ProjectSummary[];
  timestamp?: Date;
}

export default function ChatMessage({
  role,
  content,
  projects,
  timestamp,
}: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent-purple flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className={`flex-1 max-w-3xl ${role === 'user' ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block px-6 py-4 rounded-lg ${
            role === 'user'
              ? 'bg-brand-accent-purple text-white'
              : 'bg-brand-bg-darker border border-brand-bg-active text-brand-text-primary'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>

          {projects && projects.length > 0 && (
            <div className="mt-4 space-y-3">
              {projects.map(project => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="block p-4 bg-brand-bg-dark rounded-lg border border-brand-bg-active hover:border-brand-accent-purple transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-brand-text-primary group-hover:text-brand-accent-purple transition-colors">
                      {project.name}
                    </h4>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded ${
                      project.confidence >= 0.8
                        ? 'bg-green-500/20 text-green-400'
                        : project.confidence >= 0.5
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {(project.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-xs text-brand-text-secondary mb-2">
                    {project.category} • {project.status}
                  </p>

                  {project.privacyTechniques.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.privacyTechniques.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-brand-bg-active text-brand-text-muted rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {timestamp && (
          <p className="text-xs text-brand-text-muted mt-2">
            {timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>

      {role === 'user' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-bg-active flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
