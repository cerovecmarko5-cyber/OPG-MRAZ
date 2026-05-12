'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();
  const sent = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (sent.current.has(pathname)) return;
    sent.current.add(pathname);

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        ref: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
