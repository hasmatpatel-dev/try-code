'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Flame, BookOpen, Clock, Users, ArrowRight, Star, GraduationCap } from 'lucide-react';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
});

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
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      {/* Background radial glow */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-16 space-y-12 flex flex-col min-h-screen">
            {/* Title Section (Matching Landing Page Style) */}
            <div className="flex flex-col gap-4 max-w-2xl text-left pb-8 border-b border-border/40">
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm text-muted-foreground font-normal tracking-wide uppercase">Bootcamps</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
                Interactive{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-purple-400`}>
                  bootcamps
                </span>
              </h1>
              <p className="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
                Master full-stack programming, Next.js production architectures, and AI engineering with expert, interactive lessons.
              </p>
            </div>
          
          {/* Search Bar - Nested style */}
          <div className="relative w-full md:max-w-md shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </span>
            <input
              type="text"
              placeholder="Search bootcamps, topics, or lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-muted border border-border/40 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-md"
            />
          </div>

        {/* Categories Tab Selector */}
        <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`snap-center shrink-0 px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 border cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground border-border/40 hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses List - Responsive Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredCourses.map((course, idx) => {
            // Determine border colors & text accent colors based on course type
            let accentColor = "text-purple-400";
            if (course.category === 'Database') {
              accentColor = "text-emerald-400";
            } else if (course.category === 'AI') {
              accentColor = "text-blue-400";
            } else if (course.category === 'Frontend') {
              accentColor = "text-amber-400";
            }

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={course.id}
                className="h-full"
              >
                <Card className="bg-muted ring-0 border border-border/40 hover:border-primary/30 transition-all duration-300 rounded-2xl h-full shadow-2xl relative overflow-hidden group">
                  <CardContent className="p-8 flex flex-col justify-between h-full gap-8">
                    {/* Header Row */}
                    <div className="flex justify-between items-start w-full">
                      <span className={cn("text-xs font-bold tracking-widest uppercase", accentColor)}>
                        {course.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-background border border-border/40 px-3 py-1 rounded-full text-muted-foreground shadow-xs">
                        {course.badge}
                      </span>
                    </div>

                    {/* Course Title and Description */}
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight group-hover:text-primary transition-colors duration-200">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                        {course.description}
                      </p>
                    </div>

                    {/* Info Metrics Row */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/40 text-muted-foreground text-xs">
                      <div className="flex items-center space-x-1.5 justify-center">
                        <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1.5 justify-center border-x border-border/40">
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 justify-center">
                        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex flex-col gap-4 w-full">
                      {course.progress > 0 && (
                        <div className="space-y-1.5 w-full">
                          <div className="flex justify-between text-[10px] text-muted-foreground font-bold tracking-wider">
                            <span>PROGRESS</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-background overflow-hidden border border-border/20">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                          <span className="text-xs font-bold text-white">{course.rating}</span>
                        </div>

                        {/* Button styled to match services cta */}
                        <Link
                          href="/learning"
                          className="group text-xs font-semibold text-black bg-white hover:text-black hover:bg-white/90 rounded-full flex items-center gap-2 p-1 ps-4 pe-2 w-fit h-9 cursor-pointer transition-colors duration-200 shadow-md"
                        >
                          <span>{course.progress > 0 ? 'Resume' : 'Start Learning'}</span>
                          <div className="p-1.5 bg-black text-white rounded-full group-hover:rotate-45 transition-transform duration-300 ease-in-out">
                            <ArrowRight size={12} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground space-y-3">
              <Flame className="h-12 w-12 mx-auto text-muted-foreground/30 animate-pulse" />
              <p className="text-base font-semibold">No bootcamps match your filter criteria.</p>
            </div>
          )}
        </div>
          </div>
        </div>
        <Footer02 />
      </div>
    </div>
  );
}
