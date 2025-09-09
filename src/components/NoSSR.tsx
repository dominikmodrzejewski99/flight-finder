'use client';

import { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * NoSSR Component - Prevents server-side rendering for child components
 * 
 * Useful for components that:
 * - Have different behavior on server vs client
 * - Use browser-only APIs
 * - Are affected by browser extensions
 * - Need to avoid hydration mismatches
 * 
 * @param children - Components to render only on client
 * @param fallback - Optional fallback content for server/initial render
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
}

// Alternative hook-based approach
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
