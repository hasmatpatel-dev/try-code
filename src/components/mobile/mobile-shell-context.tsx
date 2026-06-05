'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MobileShellContextType {
  title: string;
  setTitle: (title: string) => void;
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  backButtonHref: string | null;
  setBackButtonHref: (href: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  installPrompt: any;
  showInstallBanner: boolean;
  setShowInstallBanner: (show: boolean) => void;
  triggerInstall: () => Promise<void>;
  readingMode: boolean;
  setReadingMode: (mode: boolean) => void;
}

const MobileShellContext = createContext<MobileShellContextType | undefined>(undefined);

export function MobileShellProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [title, setTitle] = useState('TryCode');
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonHref, setBackButtonHref] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  // Auto-detect page title and back button based on path
  useEffect(() => {
    setReadingMode(false); // Reset reading mode on path change
    if (pathname === '/') {
      setTitle('TryCode');
      setShowBackButton(false);
      setBackButtonHref(null);
    } else if (pathname.startsWith('/dashboard')) {
      const parts = pathname.split('/');
      const section = parts[2];
      if (!section) {
        setTitle('Dashboard');
        setShowBackButton(false);
        setBackButtonHref(null);
      } else {
        setTitle(section.charAt(0).toUpperCase() + section.slice(1));
        // Sub-pages should show a back button
        if (parts.length > 3) {
          setShowBackButton(true);
          setBackButtonHref(`/dashboard/${section}`);
        } else {
          setShowBackButton(false);
          setBackButtonHref(null);
        }
      }
    } else if (pathname.startsWith('/community/courses')) {
      if (pathname === '/community/courses') {
        setTitle('Courses');
        setShowBackButton(false);
        setBackButtonHref(null);
      } else {
        setTitle('Course Details');
        setShowBackButton(true);
        setBackButtonHref('/community/courses');
      }
    } else if (pathname.startsWith('/learning')) {
      setTitle('Learning Player');
      setShowBackButton(true);
      setBackButtonHref('/community/courses');
    } else if (pathname === '/community') {
      setTitle('Community Hub');
      setShowBackButton(false);
      setBackButtonHref(null);
    } else if (pathname === '/profile') {
      setTitle('Profile');
      setShowBackButton(false);
      setBackButtonHref(null);
    } else if (pathname.startsWith('/blog')) {
      if (pathname === '/blog') {
        setTitle('Blog & Tutorials');
        setShowBackButton(false);
        setBackButtonHref(null);
      } else {
        setTitle('Read Article');
        setShowBackButton(true);
        setBackButtonHref('/blog');
      }
    } else if (pathname.startsWith('/auth')) {
      setTitle('Welcome');
      setShowBackButton(true);
      setBackButtonHref('/');
    }
  }, [pathname]);

  // PWA Install Prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Only show banner if user has not dismissed it recently
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.log('Service Worker registered with scope:', reg.scope),
          (err) => console.error('Service Worker registration failed:', err)
        );
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setInstallPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <MobileShellContext.Provider
      value={{
        title,
        setTitle,
        showBackButton,
        setShowBackButton,
        backButtonHref,
        setBackButtonHref,
        drawerOpen,
        setDrawerOpen,
        installPrompt,
        showInstallBanner,
        setShowInstallBanner,
        triggerInstall,
        readingMode,
        setReadingMode,
      }}
    >
      {children}
    </MobileShellContext.Provider>
  );
}

export function useMobileShell() {
  const context = useContext(MobileShellContext);
  if (!context) {
    throw new Error('useMobileShell must be used within a MobileShellProvider');
  }
  return context;
}
