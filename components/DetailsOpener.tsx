'use client';

import { useEffect } from 'react';

export default function DetailsOpener() {
  useEffect(() => {
    const openDetailsFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const element = document.getElementById(hash);
      if (element && element.tagName === 'DETAILS') {
        // Open the details element
        (element as HTMLDetailsElement).open = true;
        // Scroll to it after a small delay to ensure it's open
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    // Handle initial load
    openDetailsFromHash();

    // Handle hash changes (clicking anchor links)
    window.addEventListener('hashchange', openDetailsFromHash);

    // Also handle clicks on anchor links within the page
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash) {
        const targetId = anchor.hash.slice(1);
        const element = document.getElementById(targetId);
        if (element && element.tagName === 'DETAILS') {
          e.preventDefault();
          (element as HTMLDetailsElement).open = true;
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          // Update URL hash
          history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('hashchange', openDetailsFromHash);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
