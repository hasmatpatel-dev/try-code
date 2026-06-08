'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  BookOpen,
  Terminal,
  Layers,
  X,
  Sparkles,
  Download,
} from 'lucide-react';
import { useMobileShell } from './mobile-shell-context';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const mainNavItems: NavigationItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Roadmap', href: '/#roadmaps', icon: Compass },
  { label: 'Topic', href: '/#categories', icon: BookOpen },
  { label: 'Recipes', href: '/#recipes', icon: Terminal },
  { label: 'Resources', href: '/#resources', icon: Layers },
];

export default function MobileAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      const sectionIds = ["home", "roadmaps", "categories", "recipes", "resources"];
      const headerHeight = 120; // height of sticky header plus a buffer
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection("resources");
        return;
      }
      let currentActive = "home";
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerHeight) {
            currentActive = id;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const {
    showInstallBanner,
    setShowInstallBanner,
    triggerInstall,
    readingMode,
  } = useMobileShell();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#030712] text-gray-100 font-sans select-none overflow-x-hidden antialiased">
      {/* PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 rounded-2xl border border-purple-500/30 bg-[#090D1A]/95 p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shrink-0 shadow-md animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white text-left">Install TryCode</h4>
                <p className="text-xs text-gray-400 text-left">Add to home screen for native app experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={triggerInstall}
                className="flex items-center space-x-1 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 active:scale-95 transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={() => {
                  setShowInstallBanner(false);
                  localStorage.setItem('pwa-install-dismissed', 'true');
                }}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-[#161C2C] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className="flex-1 w-full flex flex-col"
        style={{
          paddingBottom: readingMode ? '0px' : 'calc(68px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {!readingMode && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#090D1A]/90 backdrop-blur-xl border-t border-[#161C2C]/50 flex justify-around items-center px-2 py-2.5 transition-all duration-300"
            style={{
              paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {mainNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' && activeSection === 'home'
                  : item.href.startsWith('/#')
                  ? pathname === '/' && activeSection === item.href.split('#')[1]
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center w-16 py-1 text-center group cursor-pointer focus:outline-none select-none -webkit-tap-highlight-color-transparent"
                >
                  {/* Tap target minimum 48px is guaranteed by this layout block */}
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-xl transition-all active:scale-95 duration-100">
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-purple-600/10 border border-purple-500/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`h-5.5 w-5.5 transition-all duration-200 ${
                        isActive
                          ? 'text-purple-400 scale-105'
                          : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-wide mt-1 transition-colors duration-200 ${
                      isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
