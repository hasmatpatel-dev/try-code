'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'motion/react';
import { ArrowLeft, Map, Clock, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';

export default function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: roadmap, isLoading, isError } = useQuery({
    queryKey: ['roadmap', slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/roadmaps/${slug}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError || !roadmap) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-center px-4">
        <Map className="h-16 w-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white">Roadmap not found</h1>
        <p className="text-gray-400 mt-2">The learning path you're looking for doesn't exist.</p>
        <Link href="/" className="mt-6 text-purple-400 hover:underline text-sm">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      <div className="relative overflow-hidden pt-24">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="border-x border-border px-5 md:px-8 py-10">
            {/* Back link */}
            <Link href="/#roadmaps" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmaps
            </Link>

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${roadmap.color || '#8B5CF6'}20` }}>
                  {roadmap.icon || <Map className="h-7 w-7" style={{ color: roadmap.color || '#8B5CF6' }} />}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{roadmap.title}</h1>
                  {roadmap.category && (
                    <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20 mt-2">
                      {roadmap.category}
                    </span>
                  )}
                </div>
              </div>

              {roadmap.description && (
                <p className="text-lg text-gray-400 max-w-2xl">{roadmap.description}</p>
              )}
            </motion.div>

            {/* Content sections */}
            <div className="mt-16 space-y-12">
              {/* Getting Started */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-bold text-white flex items-center mb-6">
                  <CheckCircle className="h-5 w-5 mr-2.5 text-emerald-400" />
                  Getting Started
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: BookOpen, label: 'Prerequisites', desc: 'Basic programming knowledge recommended' },
                    { icon: Clock, label: 'Estimated Time', desc: '8-12 weeks' },
                    { icon: Map, label: 'Skill Level', desc: 'Beginner to Advanced' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-[#161C2C] bg-[#090D1A]/50 p-4 text-center">
                      <item.icon className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Roadmap Steps */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-bold text-white flex items-center mb-6">
                  <Map className="h-5 w-5 mr-2.5 text-purple-400" />
                  Learning Path
                </h2>
                <div className="relative pl-8 border-l-2 border-[#161C2C] space-y-8">
                  {[
                    { step: 1, title: 'Foundations', desc: 'Learn the core concepts and fundamental skills required for this path.' },
                    { step: 2, title: 'Core Skills', desc: 'Build practical expertise through hands-on projects and exercises.' },
                    { step: 3, title: 'Advanced Topics', desc: 'Dive deeper into advanced patterns, optimization, and best practices.' },
                    { step: 4, title: 'Real-World Projects', desc: 'Apply everything you\'ve learned to build production-ready applications.' },
                  ].map((item) => (
                    <div key={item.step} className="relative">
                      <div className="absolute -left-[2.15rem] h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {item.step}
                      </div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center py-8">
                <Link
                  href="/bootcamps"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Learning
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer02 />
      </div>
    </div>
  );
}
