'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  User,
  Menu,
  ChevronLeft,
  X,
  FileText,
  FolderOpen,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Users as UsersIcon,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  Download,
  LayoutDashboard,
} from 'lucide-react';
import { useMobileShell } from './mobile-shell-context';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { clearSession } from '@/features/authSlice';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const mainNavItems: NavigationItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'Learning', href: '/learning', icon: GraduationCap },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function MobileAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    title,
    showBackButton,
    backButtonHref,
    drawerOpen,
    setDrawerOpen,
    showInstallBanner,
    setShowInstallBanner,
    triggerInstall,
    readingMode,
  } = useMobileShell();

  // Close drawer on path change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, setDrawerOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearSession());
      toast.success('Logged out successfully');
      router.push('/auth/login');
      setDrawerOpen(false);
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const userRole = user?.role || 'Student';
  const hasCmsAccess = ['Admin', 'Editor', 'Author'].includes(userRole);

  const cmsNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Posts', href: '/dashboard/posts', icon: FileText, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Categories', href: '/dashboard/categories', icon: FolderOpen, roles: ['Admin', 'Editor'] },
    { label: 'Tags', href: '/dashboard/tags', icon: Tag, roles: ['Admin', 'Editor'] },
    { label: 'Media Library', href: '/dashboard/media', icon: ImageIcon, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Comments', href: '/dashboard/comments', icon: MessageSquare, roles: ['Admin', 'Editor'] },
    { label: 'Users', href: '/dashboard/users', icon: UsersIcon, roles: ['Admin'] },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['Admin'] },
  ].filter((item) => item.roles.includes(userRole));

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
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shrink-0 shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Install TryCode</h4>
                <p className="text-xs text-gray-400">Add to home screen for native app experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={triggerInstall}
                className="flex items-center space-x-1 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 active:scale-95 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={() => {
                  setShowInstallBanner(false);
                  localStorage.setItem('pwa-install-dismissed', 'true');
                }}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-[#161C2C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Header */}
      <AnimatePresence>
        {!readingMode && (
          <motion.header
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: -64 }}
            className="sticky top-0 z-40 w-full bg-[#090D1A]/80 backdrop-blur-lg border-b border-[#161C2C]/40 px-4 py-3 pb-3 flex items-center justify-between transition-all duration-300"
            style={{
              paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
            }}
          >
            <div className="flex items-center space-x-3">
              {showBackButton ? (
                <button
                  onClick={() => {
                    if (backButtonHref) {
                      router.push(backButtonHref);
                    } else {
                      router.back();
                    }
                  }}
                  className="p-2 -ml-2 rounded-xl text-gray-300 active:bg-[#161C2C] active:scale-95 transition-all"
                  aria-label="Go Back"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              ) : (
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
              )}

              <motion.h1
                key={title}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-bold tracking-tight text-white capitalize"
              >
                {title === 'TryCode' ? (
                  <span>
                    TryCode<span className="text-purple-500 font-medium text-xs ml-1 bg-purple-500/10 border border-purple-500/20 px-1 rounded-full uppercase tracking-wider">PWA</span>
                  </span>
                ) : (
                  title
                )}
              </motion.h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-xl text-gray-400 active:bg-[#161C2C] active:text-white transition"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>

              {user ? (
                <Link href="/profile" className="flex items-center">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
                    alt={user.name || 'User'}
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-500/20 active:scale-95 transition"
                  />
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="h-8 w-8 flex items-center justify-center rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 active:scale-95 transition"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className="flex-1 w-full flex flex-col"
        style={{
          paddingBottom: readingMode ? '0px' : 'calc(68px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {!readingMode && (
          <motion.nav
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#090D1A]/90 backdrop-blur-xl border-t border-[#161C2C]/50 flex justify-around items-center px-2 py-2.5 transition-all duration-300"
            style={{
              paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {mainNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center w-16 py-1 text-center group cursor-pointer focus:outline-none"
                >
                  {/* Tap Target minimum 44px height is guaranteed by the layout size */}
                  <div className="relative flex items-center justify-center h-10 w-10 rounded-xl transition-all">
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
                          : 'text-gray-400 group-hover:text-gray-200 group-active:scale-95'
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

      {/* Sliding Mobile Navigation Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#090D1A] border-l border-[#161C2C] p-5 flex flex-col justify-between"
              style={{
                paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              <div className="flex flex-col space-y-6 flex-1 overflow-y-auto pr-1">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#161C2C]/80">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="font-bold text-base text-white">TryCode</span>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">CMS & Courses</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:bg-[#161C2C] active:scale-95 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Main Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block px-3 mb-2">
                    Primary App
                  </span>
                  {mainNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                            : 'text-gray-300 hover:bg-[#161C2C]/50 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* CMS / Management Links */}
                {hasCmsAccess && (
                  <div className="space-y-1 pt-4 border-t border-[#161C2C]/50">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block px-3 mb-2 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
                      CMS Console
                    </span>
                    {cmsNavItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                              : 'text-gray-400 hover:bg-[#161C2C]/30 hover:text-white'
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5 mr-3 text-gray-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#161C2C]/80 space-y-2.5">
                <Link
                  href="/blog"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-gray-300 hover:bg-[#161C2C]/50 transition"
                >
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Public Blog</span>
                </Link>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center rounded-xl px-3 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 active:scale-95 transition"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition shadow-lg shadow-purple-600/10"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
