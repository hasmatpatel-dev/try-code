'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Play,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Eye,
  Minimize2,
  Maximize2,
  ListOrdered,
  BookOpenCheck,
  ChevronDown,
} from 'lucide-react';
import { useMobileShell } from '@/components/mobile/mobile-shell-context';
import { toast } from 'sonner';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';
import { Instrument_Serif } from 'next/font/google';
import { cn } from '@/lib/utils';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
});

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  contentHtml: React.ReactNode;
}

const lessonsData: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Introduction to Next.js 16',
    duration: '15 mins',
    completed: true,
    contentHtml: (
      <div className="space-y-4">
        <p>Next.js is a flexible React framework that gives you building blocks to create fast web applications.</p>
        <p>In this lesson, we will cover the core design principles of Next.js 16. Specifically, we will look at how the framework handles Server-First rendering and routing under the hood.</p>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-purple-300">
          <strong>Key Concept:</strong> Next.js 16 is designed to be Server-First. By default, pages are rendered on the server, saving precious bandwidth and processor cycles on user devices.
        </div>
      </div>
    ),
  },
  {
    id: 'lesson-2',
    title: 'Understanding React Server Components',
    duration: '25 mins',
    completed: true,
    contentHtml: (
      <div className="space-y-4">
        <p>React Server Components (RSC) represent a paradigm shift in how we build React applications. They allow you to write components that run exclusively on the server, fetching data directly from your database or APIs.</p>
        <p>Unlike Client Components, Server Components do not ship JavaScript to the client. This means page loads are significantly faster, particularly on low-powered mobile devices.</p>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-300">
          <strong>Performance Tip:</strong> Minimize your bundle size by moving as much logic as possible to Server Components. Only use Client Components when you need client-side interactivity like hooks (useState, useEffect) or event handlers.
        </div>
        <pre className="rounded-2xl bg-[#090D1A] p-4 text-xs font-mono border border-[#161C2C] overflow-x-auto text-purple-300">
{`// src/app/dashboard/page.tsx (Server Component)
import { db } from '@/lib/db';

export default async function Page() {
  const posts = await db.posts.findMany();
  return (
    <div>
      {posts.map(p => <h2 key={p.id}>{p.title}</h2>)}
    </div>
  );
}`}
        </pre>
      </div>
    ),
  },
  {
    id: 'lesson-3',
    title: 'Server Actions & Mutations',
    duration: '20 mins',
    completed: false,
    contentHtml: (
      <div className="space-y-4">
        <p>Server Actions are asynchronous functions that are executed on the server. They can be invoked directly inside Client or Server Components to handle form submissions and data mutations in your Next.js application.</p>
        <p>By declaring a function with the `&quot;use server&quot;` directive, Next.js handles the API endpoint generation and request fetching automatically for you.</p>
        <pre className="rounded-2xl bg-[#090D1A] p-4 text-xs font-mono border border-[#161C2C] overflow-x-auto text-emerald-300">
{`// src/actions/post.ts
"use server";

import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  // Save to database
  await db.post.create({ data: { title } });
  redirect("/posts");
}`}
        </pre>
      </div>
    ),
  },
  {
    id: 'lesson-4',
    title: 'Caching Strategies in Next.js',
    duration: '30 mins',
    completed: false,
    contentHtml: (
      <div className="space-y-4">
        <p>Caching in Next.js optimizes performance and reduces server billing costs. Next.js employs four distinct caching mechanisms:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Request Memoization</li>
          <li>Data Cache</li>
          <li>Full Route Cache</li>
          <li>Router Cache</li>
        </ul>
        <p>In this lesson, you will learn how to configure the Data Cache using fetch options like `revalidate` and tags for on-demand caching revalidation.</p>
      </div>
    ),
  },
];

export default function LearningPage() {
  const { readingMode, setReadingMode } = useMobileShell();
  const [activeLessonIdx, setActiveLessonIdx] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLesson = lessonsData[activeLessonIdx];

  // Calculate overall course progress
  const completedCount = lessonsData.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessonsData.length) * 100);

  const handleNext = () => {
    if (activeLessonIdx < lessonsData.length - 1) {
      // Mark current lesson completed for feedback
      lessonsData[activeLessonIdx].completed = true;
      setActiveLessonIdx((prev) => prev + 1);
      toast.success('Lesson completed! Moving to the next one.');
    } else {
      toast.success('Congratulations! You completed the course.');
    }
  };

  const handlePrev = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground flex flex-col">
      {!readingMode && <Header className="fixed top-0 z-50 w-full flex" />}

      {/* Background radial glow */}
      <div className={cn("relative flex-1 flex flex-col w-full", readingMode ? "" : "pt-20")}>
        {!readingMode && (
          <>
            <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
          </>
        )}

        <div className={cn("w-full flex-1 flex flex-col", readingMode ? "p-5 py-8" : "max-w-7xl mx-auto px-4 lg:px-8 xl:px-16")}>
          <div className={cn("w-full flex-1 flex flex-col space-y-6", readingMode ? "" : "border-x border-border px-5 md:px-8 py-12 lg:py-16")}>
            {/* Header and Progress Indicator */}
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpenCheck className="h-5 w-5 text-purple-500" />
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                    NEXT.JS PLATFORM BOOTCAMP
                  </span>
                </div>

                {/* Full-Screen Reading Mode Button */}
                <button
                  onClick={() => {
                    setReadingMode(!readingMode);
                    toast(readingMode ? 'Exited reading mode' : 'Entered full-screen reading mode');
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#090D1A] border border-[#161C2C] text-[10px] font-bold text-gray-300 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  {readingMode ? (
                    <>
                      <Minimize2 className="h-3 w-3 mr-1" />
                      <span>Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3 w-3 mr-1" />
                      <span>Reading Mode</span>
                    </>
                  )}
                </button>
              </div>

        {/* Progress Bar with Micro-animation */}
        <div className="space-y-1 bg-[#090D1A] p-3 rounded-2xl border border-[#161C2C]/60">
          <div className="flex justify-between text-[10px] font-extrabold text-gray-400">
            <span>COURSE COMPLETE STATUS</span>
            <span className="text-purple-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#161C2C] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Lesson Navigation Accordion Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between rounded-2xl bg-[#090D1A] border border-[#161C2C] p-4 text-left active:scale-99 transition"
        >
          <div className="flex items-center space-x-3">
            <ListOrdered className="h-5 w-5 text-purple-400" />
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block leading-none">
                LESSON {activeLessonIdx + 1} OF {lessonsData.length}
              </span>
              <span className="text-sm font-extrabold text-white mt-1 block">
                {activeLesson.title}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              {/* Overlay */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              {/* Dropdown Card */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-2 z-20 rounded-2xl border border-[#161C2C] bg-[#090D1A]/95 backdrop-blur-xl shadow-2xl overflow-hidden p-2 space-y-1"
              >
                {lessonsData.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIdx(idx);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-semibold transition ${
                      activeLessonIdx === idx
                        ? 'bg-purple-600/15 text-purple-300 border border-purple-500/20'
                        : 'text-gray-400 hover:bg-[#161C2C] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      {lesson.completed ? (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full border border-gray-600 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold shrink-0 pl-2">
                      {lesson.duration}
                    </span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Lesson Content Area - High Fidelity Mobile Typography */}
      <div className="flex-1 bg-[#090D1A]/35 rounded-3xl border border-[#161C2C]/40 p-5 md:p-6 overflow-y-auto space-y-4">
        <AnimatePresence mode="wait">
          <motion.article
            key={activeLesson.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed"
          >
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-[#161C2C]/50 pb-2 mb-4">
              {activeLesson.title}
            </h2>
            {activeLesson.contentHtml}
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Sticky Lesson Controls Bar */}
      <div className="pt-2 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={activeLessonIdx === 0}
            className={`flex items-center justify-center space-x-2 rounded-2xl border px-5 py-3.5 text-xs font-bold transition active:scale-95 ${
              activeLessonIdx === 0
                ? 'border-gray-800 text-gray-600 bg-transparent cursor-not-allowed'
                : 'border-[#161C2C] bg-[#090D1A] text-gray-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-purple-600 py-3.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition shadow-lg shadow-purple-600/10"
          >
            <span>
              {activeLessonIdx === lessonsData.length - 1 ? 'Finish Bootcamp' : 'Complete & Next'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>
      </div>
      {!readingMode && <Footer02 />}
      </div>
    </div>
  );
}
