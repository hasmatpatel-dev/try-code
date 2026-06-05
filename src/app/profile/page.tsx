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
    <div className="min-h-screen bg-[#030712] py-4 px-4 md:py-8 md:px-8 space-y-6">
      {/* Profile Header Widget */}
      <div className="rounded-3xl border border-[#161C2C] bg-gradient-to-br from-[#090D1A] to-[#030712] p-5 shadow-xl flex items-center space-x-4">
        <div className="relative">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'profile'}`}
            alt={user?.name || 'User'}
            className="h-16 w-16 rounded-2xl bg-[#090D1A] border-2 border-purple-500/30 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-[#090D1A] flex items-center justify-center">
            <ShieldCheck className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-white leading-tight">{user?.name || 'TryCode Student'}</h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
            {user?.role || 'Student'}
          </span>
          <div className="flex items-center text-[10px] text-gray-500 mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Member since June 2026</span>
          </div>
        </div>
      </div>

      {/* Streak and completed bootcamps cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-3.5 text-center">
          <Flame className="h-5 w-5 mx-auto text-amber-500 mb-1" />
          <span className="text-base font-extrabold text-white block">7 Days</span>
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Active Streak</span>
        </div>
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-3.5 text-center">
          <BookOpen className="h-5 w-5 mx-auto text-purple-400 mb-1" />
          <span className="text-base font-extrabold text-white block">12</span>
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Lessons Done</span>
        </div>
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-3.5 text-center">
          <Award className="h-5 w-5 mx-auto text-emerald-400 mb-1" />
          <span className="text-base font-extrabold text-white block">1</span>
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Certificates</span>
        </div>
      </div>

      {/* High-Fidelity Custom Study Activity Chart */}
      <div className="rounded-3xl border border-[#161C2C] bg-[#090D1A]/50 p-5 shadow-lg space-y-4">
        <div>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Weekly Activity</h3>
          <p className="text-[10px] text-gray-500">Daily learning study time in minutes.</p>
        </div>

        <div className="flex justify-between items-end h-28 pt-2.5">
          {studyData.map((data) => {
            const pct = Math.max(5, Math.round((data.mins / maxMins) * 100));
            return (
              <div key={data.day} className="flex flex-col items-center flex-1 space-y-2">
                <div className="relative group w-3 md:w-5 flex justify-center items-end h-20 bg-[#161C2C]/30 rounded-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-full bg-gradient-to-t from-purple-600 to-indigo-500 shadow-md shadow-purple-600/10"
                  />
                  {/* Tooltip on tap */}
                  <span className="absolute -top-5 text-[8px] font-extrabold text-purple-400 opacity-0 group-hover:opacity-100 transition duration-150">
                    {data.mins}m
                  </span>
                </div>
                <span className="text-[9px] font-bold text-gray-500">{data.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Settings Form - Keyboard & Touch Optimized */}
      <div className="rounded-3xl border border-[#161C2C] bg-[#090D1A]/50 p-5 shadow-lg space-y-4">
        <div>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Account Settings</h3>
          <p className="text-[10px] text-gray-500">Update preferences and platform visibility.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-left">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">FULL NAME</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full p-3.5 rounded-2xl bg-[#030712] border text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all ${
                errors.name ? 'border-red-500' : 'border-[#161C2C]'
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">EMAIL ADDRESS</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-600" />
              </span>
              <input
                disabled
                type="email"
                placeholder="email@example.com"
                value={email}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#030712]/50 border border-gray-900 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[9px] text-gray-600">Email addresses cannot be modified. Contact platform admin.</p>
          </div>

          {/* Biography */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">BIOGRAPHY</label>
            <textarea
              rows={3}
              placeholder="Describe your development path, goals or learning journey..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                if (errors.bio) setErrors({ ...errors, bio: undefined });
              }}
              className={`w-full p-3.5 rounded-2xl bg-[#030712] border text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all ${
                errors.bio ? 'border-red-500' : 'border-[#161C2C]'
              }`}
            />
            {errors.bio && <p className="text-[10px] text-red-500 font-bold">{errors.bio}</p>}
          </div>

          {/* Save Action */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-purple-600 py-3.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition shadow-lg shadow-purple-600/15"
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
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-4 text-xs font-bold text-red-400 hover:bg-red-500/10 active:scale-95 transition"
      >
        <LogOut className="h-4 w-4" />
        <span>Log Out Account</span>
      </button>
    </div>
  );
}
