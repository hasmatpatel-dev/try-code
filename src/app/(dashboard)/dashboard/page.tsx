'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Folder,
  Tag,
  ArrowUpRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const fetchDashboardStats = async (range: string) => {
  const { data } = await axios.get(`/api/dashboard/stats?range=${range}`);
  return data;
};

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function DashboardPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats', range],
    queryFn: () => fetchDashboardStats(range),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="text-sm text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500">Failed to load dashboard metrics. Please reload.</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      description: 'All created articles & tutorials',
      color: 'from-blue-600/20 to-blue-600/5 text-blue-400 border-blue-500/10',
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: CheckCircle,
      description: 'Live & accessible to public',
      color: 'from-emerald-600/20 to-emerald-600/5 text-emerald-400 border-emerald-500/10',
    },
    {
      title: 'Drafts',
      value: stats.draftPosts,
      icon: Clock,
      description: 'Saves & pending revisions',
      color: 'from-amber-600/20 to-amber-600/5 text-amber-400 border-amber-500/10',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: 'Combined read count across posts',
      color: 'from-purple-600/20 to-purple-600/5 text-purple-400 border-purple-500/10',
    },
  ];

  return (
    <>
      {/* DESKTOP DASHBOARD - UNTOUCHED */}
      <div className="hidden md:block space-y-6">
        {/* Upper header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-400">Metrics, traffic trends, and content performance insights.</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
              className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none ring-offset-gray-950 transition focus:border-purple-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* Grid of stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={card.title}
                className={`rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide uppercase opacity-75">{card.title}</span>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">{card.value}</span>
                  <p className="mt-1 text-xs opacity-60">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Views Trend */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
                  View Trends
                </h3>
                <p className="text-xs text-gray-500">Visitor counts over the selected timeframe.</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.viewsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161C2C" />
                  <XAxis dataKey="date" stroke="#4B5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4B5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D1A', border: '1px solid #161C2C', borderRadius: '12px' }}
                    labelStyle={{ color: '#9CA3AF', fontSize: 11 }}
                    itemStyle={{ color: '#FFF', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#viewsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Categories distribution */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl flex flex-col"
          >
            <div>
              <h3 className="font-bold text-white flex items-center">
                <Folder className="h-4 w-4 mr-2 text-indigo-400" />
                Category Share
              </h3>
              <p className="text-xs text-gray-500">Distribution of articles by category.</p>
            </div>
            <div className="h-64 flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D1A', border: '1px solid #161C2C', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFF', fontSize: 12 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Top Performing content */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                  Popular Articles
                </h3>
                <p className="text-xs text-gray-500">Top viewed posts in your blog database.</p>
              </div>
              <Link
              href="/posts"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center hover:underline"
              >
                All Posts
                <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#161C2C] space-y-3">
              {stats.topPosts.map((post: any, index: number) => (
                <div key={post.id} className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="flex items-center space-x-3 truncate">
                    <span className="text-xs font-bold text-gray-500 w-4">#{index + 1}</span>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate hover:text-purple-400 transition">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          {post.title}
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500 truncate">/blog/{post.slug}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-white">{post.views.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Views</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Database info card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-white flex items-center">
                <Tag className="h-4 w-4 mr-2 text-blue-400" />
                Content Summary
              </h3>
              <p className="text-xs text-gray-500">Database classification and indexing parameters.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="rounded-xl bg-[#090D1A] p-4 border border-[#161C2C] text-center">
                <span className="text-2xl font-bold text-white block">{stats.totalCategories}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Categories</span>
              </div>
              <div className="rounded-xl bg-[#090D1A] p-4 border border-[#161C2C] text-center">
                <span className="text-2xl font-bold text-white block">{stats.totalTags}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Tags</span>
              </div>
            </div>

            <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-3 text-xs text-purple-300">
              <strong>System Status:</strong> Relational database is active. Database migrations are fully applied. Auto-generating SEO canonical values.
            </div>
          </motion.div>
        </div>
      </div>

      {/* MOBILE DASHBOARD - COMPACT, SWIPEABLE, APP-LIKE */}
      <div className="block md:hidden space-y-5 px-1 py-2">
        {/* Header Area */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Overview</h2>
            <p className="text-[11px] text-gray-400">Real-time statistics & analytics</p>
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>

        {/* Swipeable Metrics Section */}
        <div className="relative">
          <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  key={card.title}
                  className={`snap-center shrink-0 w-60 rounded-2xl border bg-gradient-to-br p-4.5 shadow-md flex flex-col justify-between ${card.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">{card.title}</span>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-5">
                    <span className="text-2xl font-extrabold text-white">{card.value}</span>
                    <p className="mt-1 text-[10px] opacity-60">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center space-x-1 mt-1 text-gray-600 text-[10px]">
            <span>Swipe for more metrics</span>
            <span className="animate-pulse">→</span>
          </div>
        </div>

        {/* Simple Chart Section */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                Views Trend
              </h3>
            </div>
            <span className="text-[10px] text-gray-500">Selected Range</span>
          </div>
          <div className="h-44 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.viewsTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161C2C" vertical={false} />
                <XAxis dataKey="date" stroke="#4B5563" fontSize={9} tickLine={false} />
                <YAxis stroke="#4B5563" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090D1A', border: '1px solid #161C2C', borderRadius: '8px', padding: '6px' }}
                  labelStyle={{ color: '#9CA3AF', fontSize: 9 }}
                  itemStyle={{ color: '#FFF', fontSize: 10 }}
                />
                <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={1.5} fillOpacity={1} fill="url(#viewsGradMobile)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Summary (Categories & Tags Grid) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-3.5 text-center">
            <Folder className="h-4 w-4 mx-auto text-indigo-400 mb-1" />
            <span className="text-lg font-bold text-white block">{stats.totalCategories}</span>
            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Categories</span>
          </div>
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-3.5 text-center">
            <Tag className="h-4 w-4 mx-auto text-blue-400 mb-1" />
            <span className="text-lg font-bold text-white block">{stats.totalTags}</span>
            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Tags</span>
          </div>
        </div>

        {/* Popular Articles List */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              Popular Articles
            </h3>
            <Link
              href="/dashboard/posts"
              className="text-[10px] text-purple-400 font-semibold flex items-center hover:underline"
            >
              All Posts
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#161C2C] space-y-2.5">
            {stats.topPosts.slice(0, 3).map((post: any, index: number) => (
              <div key={post.id} className="flex items-center justify-between pt-2.5 first:pt-0">
                <div className="flex items-center space-x-2.5 truncate">
                  <span className="text-[10px] font-bold text-gray-500 w-3">#{index + 1}</span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        {post.title}
                      </Link>
                    </p>
                    <p className="text-[9px] text-gray-500 truncate">/blog/{post.slug}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-bold text-white">{post.views.toLocaleString()}</span>
                  <p className="text-[8px] text-gray-500 uppercase tracking-wider">Views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status Alert Banner */}
        <div className="rounded-2xl bg-purple-500/5 border border-purple-500/10 p-3 text-[10px] text-purple-300 text-center">
          <strong>TryCode CMS App Mode:</strong> Auto-synced and cached offline.
        </div>
      </div>
    </>
  );
}
