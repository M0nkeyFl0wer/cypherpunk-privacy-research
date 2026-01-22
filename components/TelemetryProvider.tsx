'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/telemetry';

/**
 * Telemetry provider that tracks page views automatically.
 * Add this to your root layout to enable tracking.
 *
 * All data is stored locally - nothing is sent to external servers.
 */
export default function TelemetryProvider({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    trackPageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}
