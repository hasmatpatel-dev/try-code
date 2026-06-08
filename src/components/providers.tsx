'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/lib/store';
import AuthSync from './auth-sync';

export default function Providers({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('DEBUG - Unhandled promise rejection details:', {
        reason: event.reason,
        promise: event.promise,
        message: event.reason?.message || (event.reason ? String(event.reason) : 'No reason provided'),
        stack: event.reason?.stack || 'No stack trace available',
      });
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  return (
    <Provider store={store}>
      <AuthSync />
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors theme="dark" closeButton />
      </QueryClientProvider>
    </Provider>
  );
}

