'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Image,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  BookOpen,
  ExternalLink,
  Loader2,
  Globe,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setSession, clearSession } from '@/features/authSlice';
import { toggleSidebar, updatePreferences } from '@/features/userSlice';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Editor', 'Author'] },
  { title: 'Posts', href: '/posts', icon: FileText, roles: ['Admin', 'Editor', 'Author'] },
  { title: 'Categories', href: '/categories', icon: FolderOpen, roles: ['Admin', 'Editor'] },
  { title: 'Tags', href: '/tags', icon: Tag, roles: ['Admin', 'Editor'] },
  { title: 'Media Library', href: '/media', icon: Image, roles: ['Admin', 'Editor', 'Author'] },
  { title: 'Comments', href: '/comments', icon: MessageSquare, roles: ['Admin', 'Editor'] },
  { title: 'Users', href: '/users', icon: Users, roles: ['Admin'] },
  { title: 'Settings', href: '/settings', icon: Settings, roles: ['Admin'] },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.user.preferences);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // Sync auth state on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          dispatch(
            setSession({
              session: data.session,
              user: {
                id: data.session.user.id,
                email: data.session.user.email!,
                name: data.session.user.user_metadata?.name || data.session.user.email!.split('@')[0],
                avatarUrl: data.session.user.user_metadata?.avatarUrl || data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture || null,
                role: data.session.user.user_metadata?.role || 'Student',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            })
          );
        } else {
          dispatch(clearSession());
          const redirectParam = typeof window !== 'undefined' && window.location.pathname
            ? `?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
            : '';
          router.push(`/auth/login${redirectParam}`);
        }
      } catch (err) {
        console.error('Session syncing failed:', err);
      } finally {
        setSyncing(false);
      }
    };

    checkSession();
  }, [dispatch, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearSession());
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (syncing || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500 mx-auto" />
          <p className="text-sm text-gray-400">Loading your CMS Dashboard...</p>
        </div>
      </div>
    );
  }

  // If user role is not allowed in CMS dashboard, show unauthorized
  const userRole = user?.role || 'Student';
  const hasAccess = userRole !== 'Student';

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-4 text-center text-white">
        <ShieldAlertIcon className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          Only administrators, editors, and authors can access the CMS area. Your current role is <strong>{userRole}</strong>.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            href="/"
            className="rounded-xl bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
          >
            Go to Home Page
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Filter sidebar items by user role
  const allowedSidebarItems = sidebarItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-[#090D1A] border-r border-[#161C2C] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#161C2C]">
          <Link href="/dashboard" className="flex items-center space-x-3 overflow-hidden select-none">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shrink-0 shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                TryCode<span className="text-purple-500 font-medium text-xs ml-1 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">CMS</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {allowedSidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl p-3 text-sm font-medium transition group relative ${
                  isActive
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                    : 'text-gray-400 hover:bg-[#111827] hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`} />
                {sidebarOpen ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 truncate">
                    {item.title}
                  </motion.span>
                ) : (
                  <div className="absolute left-16 scale-0 rounded bg-gray-900 p-2 text-xs text-white group-hover:scale-100 transition duration-150 shadow-md z-50">
                    {item.title}
                  </div>
                )}
                {isActive && sidebarOpen && (
                  <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-purple-500 shadow-md" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#161C2C] space-y-1">
          <Link
            href="/blog"
            className="flex items-center rounded-xl p-3 text-sm text-gray-400 hover:bg-[#111827] hover:text-white transition group"
          >
            <Globe className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="ml-3 truncate">Visit Site</span>}
            {sidebarOpen && <ExternalLink className="h-3 w-3 ml-auto text-gray-500 group-hover:text-gray-300" />}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl p-3 text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="ml-3 truncate">Logout</span>}
          </button>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden md:flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-300 border-t border-[#161C2C]/50 mt-2"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 hidden md:flex items-center justify-between px-4 md:px-6 bg-[#090D1A]/85 backdrop-blur-md border-b border-[#161C2C] sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-[#111827] hover:text-white transition"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb info */}
            <div className="text-sm font-medium text-gray-400 hidden sm:block">
              CMS Admin <span className="mx-2 text-[#161C2C] select-none">/</span>{' '}
              <span className="text-white capitalize">
                {pathname.split('/')[1] || 'Overview'}
              </span>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification trigger */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-[#111827] hover:text-white transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-[#090D1A]" />
            </button>

            {/* Profile widget */}
            <div className="flex items-center space-x-3 pl-2 border-l border-[#161C2C]">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                <p className="text-xs text-purple-400 font-medium capitalize">{user?.role}</p>
              </div>
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                alt={user?.name || 'User'}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-purple-500/20"
              />
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#090D1A] border-r border-[#161C2C] z-50 p-4 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-[#161C2C]">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-white">TryCode</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-[#111827]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                {allowedSidebarItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center rounded-xl p-3 text-sm font-medium transition ${
                        isActive ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:bg-[#111827] hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="ml-3 truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#161C2C] space-y-2">
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center rounded-xl p-3 text-sm text-gray-400 hover:bg-[#111827] hover:text-white transition"
                >
                  <Globe className="h-5 w-5 shrink-0" />
                  <span className="ml-3 truncate">Visit Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center rounded-xl p-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="ml-3 truncate">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Minimal placeholder fallback icon
function ShieldAlertIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
