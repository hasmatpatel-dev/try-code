'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Flame, BookOpen, Clock, Users, ArrowRight, Star, GraduationCap } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: number;
  duration: string;
  students: number;
  rating: number;
  progress: number;
  color: string;
  badge: string;
}

const coursesData: Course[] = [
  {
    id: 'nextjs-16',
    title: 'Next.js 16 Production Architectures',
    description: 'Master React Server Components, Server Actions, App Router optimization, and edge deployment strategies.',
    category: 'Full-Stack',
    lessons: 16,
    duration: '8.5 hrs',
    students: 1840,
    rating: 4.9,
    progress: 62,
    color: 'from-black to-gray-900 border-purple-500/20 text-purple-400',
    badge: 'Hot',
  },
  {
    id: 'supabase-postgres',
    title: 'Supabase & Postgres Masterclass',
    description: 'Learn PostgreSQL query optimization, row-level security, realtime databases, and edge function scripting.',
    category: 'Database',
    lessons: 12,
    duration: '6.2 hrs',
    students: 1204,
    rating: 4.8,
    progress: 33,
    color: 'from-[#022c22] to-[#041d18] border-emerald-500/20 text-emerald-400',
    badge: 'Popular',
  },
  {
    id: 'ai-development',
    title: 'AI Code Assistant Integration',
    description: 'Build your own AI coder tool utilizing Gemini, Vercel AI SDK, and Anthropic APIs inside Next.js application.',
    category: 'AI',
    lessons: 8,
    duration: '4.8 hrs',
    students: 952,
    rating: 4.7,
    progress: 0,
    color: 'from-[#1e1b4b] to-[#0f172a] border-blue-500/20 text-blue-400',
    badge: 'New',
  },
  {
    id: 'react-19-patterns',
    title: 'Advanced React 19 Patterns',
    description: 'Dive deep into Server Actions, useActionState, Suspense architectures, and the React Compiler compilation.',
    category: 'Frontend',
    lessons: 10,
    duration: '5.5 hrs',
    students: 1420,
    rating: 4.9,
    progress: 0,
    color: 'from-[#1c1917] to-[#0c0a09] border-amber-500/20 text-amber-400',
    badge: 'Updated',
  },
];

const categories = ['All', 'Full-Stack', 'Database', 'AI', 'Frontend'];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030712] py-4 px-4 md:py-8 md:px-8 space-y-6">
      {/* Page Title & Intro */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
          <GraduationCap className="h-7 w-7 mr-2 text-purple-500" />
          Interactive Bootcamps
        </h1>
        <p className="text-xs md:text-sm text-gray-400">Master full-stack programming and AI engineering with expert lessons.</p>
      </div>

      {/* Search Bar - Larger Touch Targets */}
      <div className="relative w-full max-w-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </span>
        <input
          type="text"
          placeholder="Search bootcamps, topics, or lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#090D1A] border border-[#161C2C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-md"
        />
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`snap-center shrink-0 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 border border-purple-500/30'
                : 'bg-[#090D1A] text-gray-400 hover:text-white border border-[#161C2C]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses List - Responsive Card Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {filteredCourses.map((course, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            key={course.id}
            className={`flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-5 md:p-6 shadow-xl backdrop-blur-xl transition hover:border-purple-500/40 relative overflow-hidden group ${course.color}`}
          >
            {/* Top Badge */}
            <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full shadow-inner">
              {course.badge}
            </span>

            {/* Course Content */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                {course.category}
              </span>
              <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight group-hover:text-purple-300 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                {course.description}
              </p>
            </div>

            {/* Info Metrics Row */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#161C2C]/50 my-4 text-gray-400 text-[10px] md:text-xs">
              <div className="flex items-center space-x-1.5 justify-center">
                <BookOpen className="h-4 w-4 shrink-0 text-purple-400" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-center border-x border-[#161C2C]/50">
                <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-center">
                <Users className="h-4 w-4 shrink-0 text-blue-400" />
                <span>{course.students.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress Bar & Actions */}
            <div className="space-y-3.5">
              {course.progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                    <span>PROGRESS</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#161C2C] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                  <span className="text-xs font-bold text-white">{course.rating}</span>
                </div>

                <Link
                  href="/learning"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white text-black hover:bg-purple-600 hover:text-white text-xs font-extrabold active:scale-95 transition shadow-md"
                >
                  <span>{course.progress > 0 ? 'Resume' : 'Start Learning'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 space-y-2">
            <Flame className="h-10 w-10 mx-auto text-gray-600" />
            <p className="text-sm font-semibold">No bootcamps match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
