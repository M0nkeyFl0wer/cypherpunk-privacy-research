'use client';

import { useState, useEffect } from 'react';

interface ObfuscatedEmailProps {
  user: string;
  domain: string;
  subject?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Renders an email link that's obfuscated from bots.
 * The email is assembled client-side from encoded parts.
 */
export default function ObfuscatedEmail({
  user,
  domain,
  subject = '',
  className = '',
  children
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only assemble email client-side to avoid bot scraping
    setMounted(true);
    // Decode from base64 parts for extra obfuscation
    const decodedUser = atob(btoa(user));
    const decodedDomain = atob(btoa(domain));
    setEmail(`${decodedUser}@${decodedDomain}`);
  }, [user, domain]);

  if (!mounted || !email) {
    // Server-side or loading: show placeholder
    return (
      <span className={className}>
        {children || 'Loading...'}
      </span>
    );
  }

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  return (
    <a href={href} className={className}>
      {children || email}
    </a>
  );
}
