'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Code,
  Terminal,
  ChevronRight,
  Play,
  ArrowRight,
  BookOpen,
  Layers,
  CheckCircle2,
  MessageSquare,
  Send,
  Mail,
  Copy,
  Check,
  Star,
  Globe,
  Cpu,
  Wrench,
  Shield,
  Compass,
  Book,
  ArrowUpRight,
  Laptop,
  Flame,
  ArrowRightLeft,
  Search,
  BookMarked
} from 'lucide-react';
import Header from '../shadcn-space/blocks/hero/header';

// --- TYPES ---
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date | string;
  author: {
    name: string | null;
    avatarUrl: string | null;
  };
  categories?: { name: string; slug: string }[];
}

interface HomeClientProps {
  latestArticles: Article[];
}

// --- MOCK RECIPES DATA ---
const RECIPES = [
  {
    id: 'next-auth',
    title: 'Next.js Authentication',
    file: 'middleware.ts',
    lang: 'typescript',
    code: `// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Protect dashboard routes from unauthenticated users
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return res;
}`
  },
  {
    id: 'react-modal',
    title: 'React Modal',
    file: 'Modal.tsx',
    lang: 'tsx',
    code: `// components/Modal.tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0b0f19] border border-white/10 rounded-2xl p-6 shadow-2xl">
        {children}
      </div>
    </div>,
    document.body
  );
}`
  },
  {
    id: 'supabase-auth',
    title: 'Supabase Auth',
    file: 'supabase.ts',
    lang: 'typescript',
    code: `// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: \`\${window.location.origin}/auth/callback\`
    }
  });
  if (error) throw error;
  return data;
}`
  },
  {
    id: 'playwright-setup',
    title: 'Playwright Setup',
    file: 'playwright.config.ts',
    lang: 'typescript',
    code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }
  ],
});`
  },
  {
    id: 'acf-repeater',
    title: 'ACF Repeater',
    file: 'template-parts/acf-repeater.php',
    lang: 'php',
    code: `<?php
// template-parts/acf-repeater.php
if( have_rows('custom_features') ):
    echo '<div class="features-grid">';
    while( have_rows('custom_features') ) : the_row();
        $title = get_sub_field('feature_title');
        $desc = get_sub_field('feature_description');
        $icon = get_sub_field('feature_icon');
        ?>
        <div class="feature-card">
            <img src="<?php echo esc_url($icon['url']); ?>" alt="<?php echo esc_attr($icon['alt']); ?>" />
            <h3><?php echo esc_html($title); ?></h3>
            <p><?php echo esc_html($desc); ?></p>
        </div>
        <?php
    endwhile;
    echo '</div>';
endif;`
  }
];

// --- MOCK ROADMAPS ---
const ROADMAPS = [
  {
    title: 'AI-Powered Developer',
    level: 'Mid to Senior',
    desc: 'Integrate LLM APIs, prompt engineering, self-healing code, and autonomous agents in web apps.',
    modules: 12,
    lessons: 48,
    tech: ['GPT-4o', 'LangChain', 'Vercel AI SDK', 'Cursor'],
    color: 'from-purple-500 to-indigo-500',
    bgGlow: 'rgba(147,51,234,0.15)',
    icon: Brain
  },
  {
    title: 'React Developer',
    level: 'Beginner to Mid',
    desc: 'Master React state machine, Context API, Hooks, component performance, and testing strategies.',
    modules: 10,
    lessons: 40,
    tech: ['React 19', 'Vite', 'TypeScript', 'Zustand'],
    color: 'from-cyan-500 to-blue-500',
    bgGlow: 'rgba(6,182,212,0.15)',
    icon: Code
  },
  {
    title: 'Next.js Full Stack',
    level: 'Mid to Advanced',
    desc: 'Build scalable Server Components, Server Actions, route handlers, caching, Prisma & Supabase.',
    modules: 14,
    lessons: 56,
    tech: ['Next.js 16', 'React Server Components', 'Prisma', 'Supabase'],
    color: 'from-emerald-500 to-teal-500',
    bgGlow: 'rgba(16,185,129,0.15)',
    icon: Layers
  },
  {
    title: 'WordPress + Elementor + ACF',
    level: 'WordPress Devs',
    desc: 'Create high-converting, dynamic client websites. Master custom fields, custom loops, and performance.',
    modules: 8,
    lessons: 32,
    tech: ['WordPress', 'ACF Pro', 'Elementor', 'PHP'],
    color: 'from-orange-500 to-amber-500',
    bgGlow: 'rgba(249,115,22,0.15)',
    icon: Globe
  },
  {
    title: 'AI Testing Engineer',
    level: 'Mid Level',
    desc: 'Leverage AI agents to construct self-healing tests, test suites, automated regressions, and CI/CD runs.',
    modules: 9,
    lessons: 36,
    tech: ['Playwright', 'Cypress', 'GitHub Actions', 'AI Agents'],
    color: 'from-pink-500 to-rose-500',
    bgGlow: 'rgba(236,72,153,0.15)',
    icon: Wrench
  },
  {
    title: 'Software Architect',
    level: 'Senior / Expert',
    desc: 'System design patterns, micro-frontends, caching layers, database indexing, and scaling deployments.',
    modules: 16,
    lessons: 64,
    tech: ['System Design', 'Docker', 'Redis', 'AWS'],
    color: 'from-blue-500 to-indigo-600',
    bgGlow: 'rgba(59,130,246,0.15)',
    icon: Shield
  }
];

// --- MOCK CATEGORIES ---
const CATEGORIES = [
  { name: 'AI', count: 18, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5', icon: Brain },
  { name: 'Prompt Engineering', count: 12, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5', icon: Terminal },
  { name: 'React', count: 25, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5', icon: Code },
  { name: 'Next.js', count: 32, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: Layers },
  { name: 'WordPress', count: 20, color: 'text-sky-400 border-sky-500/20 bg-sky-500/5', icon: Globe },
  { name: 'Elementor', count: 14, color: 'text-orange-400 border-orange-500/20 bg-orange-500/5', icon: Star },
  { name: 'ACF Pro', count: 11, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: BookOpen },
  { name: 'Webflow', count: 9, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', icon: Laptop },
  { name: 'Framer', count: 15, color: 'text-pink-400 border-pink-500/20 bg-pink-500/5', icon: Sparkles },
  { name: 'UI/UX', count: 22, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', icon: Compass },
  { name: 'Testing', count: 16, color: 'text-teal-400 border-teal-500/20 bg-teal-500/5', icon: Wrench },
  { name: 'Performance', count: 19, color: 'text-green-400 border-green-500/20 bg-green-500/5', icon: Flame },
  { name: 'Architecture', count: 15, color: 'text-violet-400 border-violet-500/20 bg-violet-500/5', icon: Shield }
];

// --- AI MENTOR QUESTIONS & RESPONSES ---
const MENTOR_DATA = [
  {
    q: 'How do I optimize Next.js LCP?',
    a: `To optimize **Largest Contentful Paint (LCP)** in Next.js:

1. **Use Next.js Image Component** with the \`priority\` attribute for any images above the fold.
2. **Defer heavy JavaScript** modules using Next.js \`next/dynamic\` loading.
3. **Preconnect & Optimize Fonts** using the native \`next/font\` package.

Here is a quick example of prioritised image landing above the fold:`,
    code: `import Image from 'next/image';

export default function HeroSection() {
  return (
    <Image 
      src="/hero-banner.jpg" 
      alt="Developer Growth" 
      width={1200} 
      height={630} 
      priority // Triggers preloading for LCP
      className="object-cover rounded-xl"
    />
  );
}`
  },
  {
    q: "Explain React 19's useActionState",
    a: `React 19 introduces **\`useActionState\`** (which succeeds \`useFormState\` from early Next.js versions). It streamlines form handling, allowing async actions while managing pending states and values automatically.

Here is how you implement it inside a form element:`,
    code: `import { useActionState } from 'react';

async function updateProfile(prevState: any, formData: FormData) {
  const email = formData.get('email');
  if (!email) return { error: 'Email is required' };
  
  // Perform network call
  return { success: true };
}

export default function Form() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <input name="email" type="email" className="input" />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}`
  },
  {
    q: 'How do I secure Wordpress ACF endpoints?',
    a: `By default, ACF Rest API endpoints can leak fields publicly. You can filter and restrict fields inside your theme's \`functions.php\`.

To block public endpoints unless the user is logged in, use this snippet:`,
    code: `add_filter('acf/rest/format_value_for_api', 'restrict_acf_rest_endpoints', 10, 3);

function restrict_acf_rest_endpoints($value, $post_id, $field) {
    // Check if REST request and user is not authenticated
    if (defined('REST_REQUEST') && REST_REQUEST && !is_user_logged_in()) {
        return null; // Suppress field value
    }
    return $value;
}`
  },
  {
    q: 'Best setup for Playwright testing?',
    a: `For lightning fast, parallel integrations in modern setups, configure Playwright to target your local server during tests.

Below is a robust config utilizing cross-browser pipelines:`,
    code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }
  ],
});`
  }
];

export default function HomeClient({ latestArticles }: HomeClientProps) {
  // --- STATE FOR FEATURED RECIPES ---
  const [activeRecipe, setActiveRecipe] = useState(RECIPES[0]);
  const [copied, setCopied] = useState(false);

  // --- STATE FOR AI MENTOR SIMULATION ---
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [chatAnswer, setChatAnswer] = useState('');
  const [chatCode, setChatCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(false);

  // --- HERO CODE SIMULATION STATE ---
  const [heroStep, setHeroStep] = useState(0);

  // Copy code helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Typist simulator for AI Mentor
  const simulateTyping = (text: string, codeBlock: string) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    setIsTyping(true);
    setChatAnswer('');
    setChatCode('');

    let charIndex = 0;
    const typingSpeed = 15; // ms per character

    typingTimerRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setChatAnswer((prev) => prev + text.charAt(charIndex));
        charIndex++;
      } else {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
        setIsTyping(false);
        // Instant render code block after typing description
        setChatCode(codeBlock);
      }
    }, typingSpeed);
  };

  // Trigger typing simulation when question changes
  useEffect(() => {
    const question = MENTOR_DATA[activeQuestionIndex];
    simulateTyping(question.a, question.code);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [activeQuestionIndex]);

  // Hero terminal simulation interval
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#030712] text-gray-100 antialiased selection:bg-purple-600/30 selection:text-white">
      {/* BACKGROUND NEBULA GLOWS */}
      <div className="absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-900/10 blur-[150px]" />
      <div className="absolute top-[800px] right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[130px]" />
      <div className="absolute bottom-[1000px] left-1/3 -z-10 h-[700px] w-[700px] rounded-full bg-emerald-955/10 blur-[180px]" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto border-x border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 w-fit"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 tracking-wide">
                Next-Gen Developer Roadmap Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white"
            >
              Modern Skills for <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Developers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-400 max-w-xl font-normal leading-relaxed"
            >
              Stop wandering through disjointed articles. Unlock structured, production-grade learning roadmaps, AI-powered mentoring, and copy-pasteable recipes designed for software engineers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <Link
                href="#roadmaps"
                className="group relative flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-500 active:scale-98 transition duration-200"
              >
                <span>Explore Roadmaps</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#recipes"
                className="flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.08] active:scale-98 transition duration-200"
              >
                <span>Start Learning</span>
              </Link>
            </motion.div>

            {/* Micro stats banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.06] max-w-lg"
            >
              <div>
                <p className="text-2xl font-bold text-white">6+</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Expert Roadmaps</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Modular Recipes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">AI Code Mentoring</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Interactive Terminal Code Simulator */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-2xl blur-3xl -z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full rounded-2xl border border-white/10 bg-[#090d16]/90 shadow-2xl backdrop-blur-xl overflow-hidden font-mono text-xs"
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] text-gray-500 font-medium">bash - trycode.sh</div>
                <div className="w-10" />
              </div>

              {/* Terminal Content */}
              <div className="p-5 space-y-4 text-gray-300 min-h-[300px]">
                <div>
                  <span className="text-emerald-400">dev@trycode:~</span>
                  <span className="text-white">$</span> npm run dev --theme=modern
                </div>

                <AnimatePresence mode="wait">
                  {heroStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <p className="text-gray-500">▶ Ready in 250ms</p>
                      <p className="text-purple-400 font-bold">● Try-Code platform active.</p>
                      <p className="text-gray-400">Loading skill matrix: [AI-Ready, NextJS, React19, WP]</p>
                      <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-500 h-1.5 rounded-full w-2/3" />
                      </div>
                    </motion.div>
                  )}

                  {heroStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 text-cyan-300"
                    >
                      <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                        <Code className="h-4 w-4" />
                        <span>Initializing React 19 Full-Stack Roadmap</span>
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">
                        Compiling server action validation tokens... <br />
                        ✓ Hydration check successful <br />
                        ✓ Static generation optimization initialized
                      </p>
                    </motion.div>
                  )}

                  {heroStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                        <Brain className="h-4 w-4" />
                        <span>AI Mentor Agent Spawned</span>
                      </div>
                      <p className="text-purple-300 italic">"How can I secure my REST API keys in Next.js Server Actions?"</p>
                      <p className="text-gray-400 leading-relaxed text-[11px]">
                        AI: "Use environment variables with 'process.env' and avoid prefixing with 'NEXT_PUBLIC_' to keep them strictly server-side."
                      </p>
                    </motion.div>
                  )}

                  {heroStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 text-orange-400 font-bold">
                        <Globe className="h-4 w-4" />
                        <span>ACF Gutenberg Block Boilerplate</span>
                      </div>
                      <p className="text-gray-400 text-[11px]">
                        [1] Register blocks via block.json <br />
                        [2] Render HTML wrapper with custom dynamic queries <br />
                        ✓ WordPress blocks mapped dynamically in React
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Terminal Footer */}
              <div className="px-5 py-2.5 bg-white/[0.01] border-t border-white/[0.05] text-[10px] text-gray-500 flex justify-between">
                <span>System: Online</span>
                <span>Branch: main</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ROADMAPS */}
      <section id="roadmaps" className="py-24 px-4 md:px-8 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Structured Paths</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Featured Career Roadmaps
              </h2>
              <p className="text-gray-400 max-w-xl font-normal">
                Curated learning pathways mapping all essential skills, concepts, and frameworks. Bypass the noise and follow a step-by-step route to mastery.
              </p>
            </div>
            <Link
              href="#categories"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition mt-4 md:mt-0"
            >
              <span>View all categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Roadmaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROADMAPS.map((roadmap, idx) => {
              const Icon = roadmap.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, borderColor: 'rgba(147, 51, 234, 0.3)' }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-2xl border border-white/5 bg-[#090d16] p-6 flex flex-col justify-between overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: `0 10px 30px -15px ${roadmap.bgGlow}`
                  }}
                >
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-50 transition-transform duration-500 group-hover:scale-125" />

                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${roadmap.color} text-white shadow-md`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {roadmap.level}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {roadmap.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-normal leading-relaxed">
                        {roadmap.desc}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {roadmap.tech.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics & CTA */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/[0.05]">
                    <div className="text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-300">{roadmap.modules} Modules</span> • {roadmap.lessons} Lessons
                    </div>
                    <span className="flex items-center space-x-1 text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                      <span>Start Pathway</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 4. FEATURED RECIPES */}
      <section id="recipes" className="py-24 px-4 md:px-8 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Recipes Left */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Practical Snippets</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Featured Code Recipes
              </h2>
              <p className="text-gray-400 font-normal leading-relaxed">
                Ditch boilerplate setup. Explore secure, optimized blocks of code curated to solve core architectural challenges. Click on any block to preview the code.
              </p>

              {/* Selector Tabs */}
              <div className="flex flex-col space-y-2 pt-4">
                {RECIPES.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      setActiveRecipe(recipe);
                      setCopied(false);
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition duration-200 cursor-pointer ${
                      activeRecipe.id === recipe.id
                        ? 'border-cyan-500/30 bg-cyan-500/5 text-white'
                        : 'border-white/5 bg-transparent text-gray-400 hover:bg-white/[0.02] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Terminal className={`h-4.5 w-4.5 ${activeRecipe.id === recipe.id ? 'text-cyan-400' : 'text-gray-500'}`} />
                      <span className="text-sm font-semibold">{recipe.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{recipe.file}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes Right: Interactive Editor Block */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-white/10 bg-[#090d16] overflow-hidden shadow-2xl">
                {/* Editor Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[11px] text-gray-400 font-mono ml-4 bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                      {activeRecipe.file}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(activeRecipe.code)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Editor Content Area */}
                <div className="p-5 overflow-x-auto bg-[#050810] text-gray-300 font-mono text-[11px] sm:text-xs leading-relaxed max-h-[420px] overflow-y-auto">
                  <pre className="whitespace-pre">
                    <code>{activeRecipe.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEARNING CATEGORIES */}
      <section id="categories" className="py-24 px-4 md:px-8 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Knowledge Map</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Learning Categories
            </h2>
            <p className="text-gray-400 font-normal">
              Explore custom-curated tags spanning AI agents, foundational client frameworks, modern styling environments, and enterprise system designs.
            </p>
          </div>

          {/* Grid of Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.1)' }}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-[#090d16] hover:bg-white/[0.02] text-center group cursor-pointer transition-all duration-200"
                >
                  <div className={`p-3 rounded-xl border mb-3 transition-colors duration-200 ${cat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 font-semibold">
                    {cat.count} Resources
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. AI MENTOR SECTION */}
      <section className="py-24 px-4 md:px-8 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* AI Left: Chat Simulation View */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl border border-white/10 bg-[#090d16] overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02] border-b border-white/[0.05]">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        TC
                      </div>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#090d16]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Try-Code AI Mentor</h4>
                      <p className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">Always Active • Expert Advisor</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Model v2.5
                  </span>
                </div>

                {/* Chat Conversation Scroll Area */}
                <div className="p-5 space-y-4 min-h-[350px] bg-[#050810]/50 text-xs">
                  {/* User Question */}
                  <div className="flex items-end justify-end space-x-2">
                    <div className="max-w-[85%] bg-purple-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 shadow-md font-medium text-right">
                      {MENTOR_DATA[activeQuestionIndex].q}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start space-x-2.5">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] shrink-0 shadow-md">
                      AI
                    </div>
                    <div className="max-w-[85%] bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 text-gray-300 leading-relaxed space-y-3 shadow-md">
                      <div className="whitespace-pre-line font-normal">
                        {chatAnswer}
                        {isTyping && <span className="inline-block h-3 w-1.5 ml-1 bg-purple-400 animate-pulse" />}
                      </div>

                      {chatCode && (
                        <div className="rounded-xl border border-white/5 bg-[#03070d] overflow-hidden mt-3">
                          <div className="flex justify-between items-center px-3 py-2 bg-white/[0.02] border-b border-white/[0.05] text-[10px] text-gray-400 font-mono">
                            <span>Boilerplate Snippet</span>
                            <button
                              onClick={() => copyToClipboard(chatCode)}
                              className="text-gray-400 hover:text-white cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-[10px] font-mono leading-relaxed text-purple-300">
                            <code>{chatCode}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chat input footer simulator */}
                <div className="px-5 py-3.5 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between gap-3 text-gray-500">
                  <span className="text-[10px]">Ask a question...</span>
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                    <Send className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Right: Copy & Prompts list */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Interactive Support</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Your Personal AI Coding Mentor
              </h2>
              <p className="text-gray-400 font-normal leading-relaxed">
                Stuck on a hydration bug or complex Gutenberg loop? Test our interactive advisor. Click on any question below to see the AI compile code-level solutions in real-time.
              </p>

              {/* Sample Questions Bubble Grid */}
              <div className="flex flex-col space-y-2 pt-2">
                {MENTOR_DATA.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isTyping) {
                        setActiveQuestionIndex(idx);
                      }
                    }}
                    disabled={isTyping}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border text-left transition duration-200 ${
                      activeQuestionIndex === idx
                        ? 'border-purple-500/30 bg-purple-500/5 text-white'
                        : 'border-white/5 bg-transparent text-gray-400 hover:bg-white/[0.02] hover:text-white cursor-pointer disabled:opacity-50'
                    }`}
                  >
                    <MessageSquare className={`h-4 w-4 ${activeQuestionIndex === idx ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span className="text-xs font-semibold">{item.q}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/learning"
                  className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-3 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-purple-600/10"
                >
                  <span>Launch Full AI Assistant</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST ARTICLES */}
      <section className="py-24 px-4 md:px-8 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Written Insights</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Latest Articles
              </h2>
              <p className="text-gray-400 max-w-xl font-normal">
                Stay updated with engineering updates, optimization frameworks, styling guides, and developer stories.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition mt-4 md:mt-0"
            >
              <span>Explore all articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => {
              const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <article
                  key={article.id}
                  className="group rounded-2xl border border-white/5 bg-[#090d16] overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all duration-300"
                >
                  {/* Article Banner image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-white/5 border-b border-white/5">
                    <img
                      src={article.coverImage || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop`}
                      alt={article.title}
                      className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                    />
                    {article.categories && article.categories.length > 0 && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-black/60 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                        {article.categories[0].name}
                      </span>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>5 min read</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-400 font-normal line-clamp-3 leading-relaxed">
                        {article.excerpt || 'Read this post to learn about modern developer workflows, codebase configurations, and how to accelerate your career growth.'}
                      </p>
                    </div>

                    {/* Author block */}
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.05]">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={article.author.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${article.author.name || 'Author'}`}
                          alt={article.author.name || 'Author'}
                          className="h-6.5 w-6.5 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <span className="text-xs text-gray-300 font-semibold">{article.author.name || 'Admin'}</span>
                      </div>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-xs font-bold text-white group-hover:text-purple-400 flex items-center space-x-0.5 transition-colors"
                      >
                        <span>Read Post</span>
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="py-24 px-4 md:px-8 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#090d16] to-[#040810] p-8 md:p-12 relative overflow-hidden shadow-2xl text-center space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl -z-10" />

          <div className="max-w-xl mx-auto space-y-4">
            <div className="mx-auto h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mail className="h-5.5 w-5.5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Get Weekly Dev Recipes
            </h2>
            <p className="text-sm text-gray-400 font-normal leading-relaxed">
              Subscribe to receive curated coding recipes, roadmap updates, and system design breakdowns direct to your inbox. No spam, ever.
            </p>
          </div>

          <div className="max-w-md mx-auto pt-2">
            {!submittedEmail ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    setSubmittedEmail(true);
                  }
                }}
                className="flex flex-col sm:flex-row items-stretch gap-2.5"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-3 text-sm font-bold text-white transition active:scale-95 shrink-0 shadow-md shadow-purple-600/10 cursor-pointer"
                >
                  Join Newsletter
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Thank you! You have successfully subscribed.</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 9. UNIFIED FOOTER */}
      <footer className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto border-x border-white/[0.04] px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="flex items-center space-x-2.5">
                <span className="text-xl font-black text-white tracking-tight uppercase">Try-Code</span>
              </Link>
              <p className="text-xs text-gray-500 max-w-sm font-medium leading-relaxed">
                Modern learning roadmaps, real projects, code recipes, and 24/7 AI mentoring engineered to accelerate your growth from mid-level to senior engineer.
              </p>
            </div>

            {/* Links columns */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Platform Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform</h4>
                <ul className="space-y-2.5 text-xs text-gray-500 font-semibold">
                  <li><Link href="#roadmaps" className="hover:text-white transition">Roadmaps</Link></li>
                  <li><Link href="#recipes" className="hover:text-white transition">Code Recipes</Link></li>
                  <li><Link href="#categories" className="hover:text-white transition">Categories</Link></li>
                  <li><Link href="/learning" className="hover:text-white transition">Learning App</Link></li>
                </ul>
              </div>

              {/* Community Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Community</h4>
                <ul className="space-y-2.5 text-xs text-gray-500 font-semibold">
                  <li><Link href="/blog" className="hover:text-white transition">Engineering Blog</Link></li>
                  <li><Link href="/community" className="hover:text-white transition">Forum Discussions</Link></li>
                  <li><Link href="/community/courses" className="hover:text-white transition">All Courses</Link></li>
                  <li><Link href="/profile" className="hover:text-white transition">Developer Profile</Link></li>
                </ul>
              </div>

              {/* Developer Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developers</h4>
                <ul className="space-y-2.5 text-xs text-gray-500 font-semibold">
                  <li><Link href="https://github.com/trycode" className="hover:text-white transition">GitHub</Link></li>
                  <li><Link href="https://x.com/trycode" className="hover:text-white transition">Twitter / X</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">CMS Admin</Link></li>
                  <li><Link href="/auth/login" className="hover:text-white transition">Sign In</Link></li>
                </ul>
              </div>
            </div>

            {/* Email column */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Support</h4>
              <p className="text-xs text-gray-500 font-semibold">Got questions or ideas? Drop us a line.</p>
              <a
                href="mailto:hello@trycode.dev"
                className="text-lg font-bold text-white hover:text-purple-300 transition-colors inline-block"
              >
                hello@trycode.dev
              </a>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 mt-12 border-t border-white/[0.04] text-[11px] text-gray-500 font-medium">
            <span>© 2026 Try-Code. All Rights Reserved. Built for developers worldwide.</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
