'use client';

import { type ReactNode, useState, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before hydration, render children directly
  // This avoids context evaluation issues during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return <QueryProviderWrapper>{children}</QueryProviderWrapper>;
}

// Separate component to isolate react-query context
function QueryProviderWrapper({ children }: { children: ReactNode }) {
  const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
