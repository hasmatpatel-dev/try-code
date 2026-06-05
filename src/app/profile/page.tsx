'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Flame,
  Award,
  BookOpen,
  Mail,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Save,
  LogOut,
  Calendar,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { clearSession } from '@/features/authSlice';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/shadcn-space/blocks/hero-01/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-[#030712]">
      <Header className="hidden md:flex" />

      <div className="py-12 px-4 md:py-20 max-w-7xl mx-auto space-y-10">
        
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
                  {user?.role || 'Student'}
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
  );
}
