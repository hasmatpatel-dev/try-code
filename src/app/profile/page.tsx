'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  LogOut,
  MailCheck,
  ShieldCheck,
  Calendar,
  Flame,
  BookOpen,
  Award,
  Save,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Users as UsersIcon,
  Settings,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { clearSession } from '@/features/authSlice';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';
import { Instrument_Serif } from 'next/font/google';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
});

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<{ name?: string; bio?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { name?: string; bio?: string } = {};

    if (!name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (name.length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }

    if (bio && bio.length > 160) {
      tempErrors.bio = 'Bio must be less than 160 characters';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile preferences updated successfully!');
      setErrors({});
    }, 800);
  };

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

  const userRole = user?.role || 'Student';
  const hasCmsAccess = ['Admin', 'Editor', 'Author'].includes(userRole);

  const cmsNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Posts', href: '/posts', icon: FileText, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Categories', href: '/categories', icon: FolderOpen, roles: ['Admin', 'Editor'] },
    { label: 'Tags', href: '/tags', icon: Tag, roles: ['Admin', 'Editor'] },
    { label: 'Media Library', href: '/media', icon: ImageIcon, roles: ['Admin', 'Editor', 'Author'] },
    { label: 'Comments', href: '/comments', icon: MessageSquare, roles: ['Admin', 'Editor'] },
    { label: 'Users', href: '/users', icon: UsersIcon, roles: ['Admin'] },
    { label: 'Settings', href: '/settings', icon: Settings, roles: ['Admin'] },
  ].filter((item) => item.roles.includes(userRole));

  // Weekly study data for custom stylized bar chart
  const studyData = [
    { day: 'Mon', mins: 45 },
    { day: 'Tue', mins: 80 },
    { day: 'Wed', mins: 30 },
    { day: 'Thu', mins: 120 },
    { day: 'Fri', mins: 60 },
    { day: 'Sat', mins: 15 },
    { day: 'Sun', mins: 90 },
  ];

  const maxMins = 120; // for height scaling

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      {/* Background radial glow */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-16 space-y-10 flex flex-col min-h-screen">
            {/* Title Section (Matching Landing Page Style) */}
            <div className="flex flex-col gap-4 max-w-2xl text-left pb-8 border-b border-border/40">
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm text-muted-foreground font-normal tracking-wide uppercase">Student Profile</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
                Your learning{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-purple-400`}>
                  dashboard
                </span>
              </h1>
              <p className="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
                Track your study activity, active streaks, achievements, and manage your account preferences.
              </p>
            </div>
        
            {/* Profile Header Widget */}
            <Card className="bg-muted ring-0 border border-border/40 rounded-2xl shadow-2xl relative overflow-hidden group">
              <CardContent className="p-8 flex items-center space-x-6">
                <div className="relative shrink-0">
                  <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'profile'}`}
                    alt={user?.name || 'User'}
                    className="h-20 w-20 rounded-2xl bg-[#090D1A] border-2 border-primary/30 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-muted flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="space-y-1.5 text-left">
                  <h2 className="text-2xl font-semibold text-white leading-tight">{user?.name || 'TryCode Student'}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-primary border-primary/30 px-3 py-0.5 rounded-full inline-block">
                      {userRole}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>Member since June 2026</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak and completed bootcamps cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-muted ring-0 border border-border/40 rounded-2xl p-6 text-center shadow-lg">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                  <Flame className="h-7 w-7 text-amber-500" />
                  <span className="text-xl md:text-2xl font-bold text-white block">7 Days</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Streak</span>
                </CardContent>
              </Card>
              <Card className="bg-muted ring-0 border border-border/40 rounded-2xl p-6 text-center shadow-lg">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                  <BookOpen className="h-7 w-7 text-primary" />
                  <span className="text-xl md:text-2xl font-bold text-white block">12</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Lessons Done</span>
                </CardContent>
              </Card>
              <Card className="bg-muted ring-0 border border-border/40 rounded-2xl p-6 text-center shadow-lg">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                  <Award className="h-7 w-7 text-emerald-400" />
                  <span className="text-xl md:text-2xl font-bold text-white block">1</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Certificates</span>
                </CardContent>
              </Card>
            </div>

            {/* High-Fidelity Custom Study Activity Chart */}
            <Card className="bg-muted ring-0 border border-border/40 rounded-2xl shadow-2xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
                  <p className="text-sm text-muted-foreground mt-1">Daily learning study time in minutes.</p>
                </div>

                <div className="flex justify-between items-end h-28 pt-2.5 max-w-2xl mx-auto">
                  {studyData.map((data) => {
                    const pct = Math.max(5, Math.round((data.mins / maxMins) * 100));
                    return (
                      <div key={data.day} className="flex flex-col items-center flex-1 space-y-2">
                        <div className="relative group w-3.5 md:w-5 flex justify-center items-end h-20 bg-background/50 border border-border/10 rounded-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="w-full rounded-full bg-gradient-to-t from-primary to-purple-500 shadow-md shadow-primary/10"
                          />
                          {/* Tooltip on hover */}
                          <span className="absolute -top-6 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition duration-150">
                            {data.mins}m
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">{data.day}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CMS Management Console - Only visible if user has CMS roles */}
            {hasCmsAccess && (
              <Card className="bg-muted ring-0 border border-border/40 rounded-2xl shadow-2xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="text-left flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/20">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-purple-400" />
                        CMS Management Console
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Control panel for publishing content, managing layouts, and monitoring comments.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {cmsNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => router.push(item.href)}
                          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-background hover:bg-purple-900/10 hover:border-purple-500/30 transition text-center cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Icon className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-purple-400 group-hover:scale-110 transition-all duration-200" />
                          <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Settings Form - Keyboard & Touch Optimized */}
            <Card className="bg-muted ring-0 border border-border/40 rounded-2xl shadow-2xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                  <p className="text-sm text-muted-foreground mt-1">Update preferences and platform visibility.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">FULL NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={cn(
                        "w-full px-4 py-3 rounded-full bg-background border text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all",
                        errors.name ? 'border-red-500' : 'border-border/40'
                      )}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">EMAIL ADDRESS</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <input
                        disabled
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-background/50 border border-border/10 text-sm text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Email addresses cannot be modified. Contact platform admin.</p>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">BIOGRAPHY</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your development path, goals or learning journey..."
                      value={bio}
                      onChange={(e) => {
                        setBio(e.target.value);
                        if (errors.bio) setErrors({ ...errors, bio: undefined });
                      }}
                      className={cn(
                        "w-full px-4 py-3.5 rounded-2xl bg-background border text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all",
                        errors.bio ? 'border-red-500' : 'border-border/40'
                      )}
                    />
                    {errors.bio && <p className="text-[10px] text-red-500 font-semibold">{errors.bio}</p>}
                  </div>

                  {/* Save Action */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 active:scale-95 transition-all shadow-lg cursor-pointer"
                  >
                    {saving ? (
                      <span className="animate-pulse">Saving changes...</span>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Profile Preferences</span>
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 rounded-full border border-red-500/20 bg-red-500/5 py-4 text-sm font-semibold text-red-400 hover:bg-red-500/10 active:scale-95 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        </div>
        <Footer02 />
      </div>
    </div>
  );
}
