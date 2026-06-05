'use client';

import React, { useEffect, useState } from 'react';
import { MobileShellProvider } from './mobile-shell-context';
import MobileAppShell from './mobile-app-shell';

export default function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MobileShellProvider>
      {!mounted ? (
        <div className="min-h-screen w-full flex flex-col">{children}</div>
      ) : isMobile ? (
        <MobileAppShell>{children}</MobileAppShell>
      ) : (
        <div className="min-h-screen w-full flex flex-col">{children}</div>
      )}
    </MobileShellProvider>
  );
}
