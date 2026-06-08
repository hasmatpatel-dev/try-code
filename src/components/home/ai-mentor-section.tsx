"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import { MessageSquare, Sparkles, Send, Terminal, Cpu } from "lucide-react";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

type QAItem = {
  question: string;
  answer: string;
};

const QA_MOCK: QAItem[] = [
  {
    question: "How does React Suspense work?",
    answer: "React Suspense lets components 'wait' for asynchronous operations (like data fetching or code splitting) before rendering. It coordinates loading states by displaying a fallback UI until the wrapped component resolves its promise."
  },
  {
    question: "Build authentication using Next.js and Supabase.",
    answer: "To secure routes in Next.js, initialize the Supabase client inside the middleware. Get the user session, and if it fails to resolve, redirect requests from protected endpoints back to the login page."
  },
  {
    question: "Create dynamic content using Elementor and ACF Pro.",
    answer: "WordPress custom loops extract values from ACF fields. In Elementor, select the dynamic tag indicator for widgets, choose ACF Field, and specify your field key to render template post lists."
  },
  {
    question: "Generate Playwright tests for this feature.",
    answer: "Write a test block compiling async page visits. Target element locators (e.g. inputs, submit buttons), trigger interactions, and assert redirects to the dashboard URL using page.goto('/dashboard')."
  },
  {
    question: "Explain performance optimization strategies.",
    answer: "Optimize Largest Contentful Paint (LCP) by pre-loading above-the-fold assets, code-splitting large bundles with dynamic imports, lazy loading images, and offloading heavy computations to server components."
  }
];

export default function AIMentorSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [typedResponse, setTypedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const simulateTyping = (text: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTyping(true);
    setTypedResponse("");
    let charIndex = 0;
    
    intervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setTypedResponse((prev) => prev + text.charAt(charIndex));
        charIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsTyping(false);
      }
    }, 12);
  };

  useEffect(() => {
    simulateTyping(QA_MOCK[selectedIdx].answer);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedIdx]);

  return (
    <section ref={sectionRef} id="ai-mentor" className="overflow-hidden border-t border-border bg-muted/5">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="border-x border-border px-5 md:px-8 py-8 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground m-1.5" />
                <span className="text-base font-normal text-muted-foreground">
                  AI-Powered Guidance
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                AI{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-primary`}>
                  Mentor.
                </span>
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Content Column (col-span-5) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <p className="text-base text-muted-foreground max-w-md font-normal leading-relaxed">
                Click any of the example developer questions to see how the AI mentor responds instantly with code-level insights.
              </p>

              {/* Questions list */}
              <div className="flex flex-col gap-2 pt-4">
                {QA_MOCK.map((qa, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isTyping) {
                        setSelectedIdx(idx);
                      }
                    }}
                    disabled={isTyping}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm transition-all cursor-pointer disabled:opacity-60 ${
                      selectedIdx === idx
                        ? "border-primary bg-primary/5 text-foreground font-medium"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>{qa.question}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium text-sm transition-colors cursor-pointer"
                >
                  Try AI Mentor
                </Link>
              </div>
            </div>

            {/* Right Chat Sandbox Column (col-span-7) */}
            <div className="lg:col-span-7 w-full">
              <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-2xl flex flex-col">
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/10">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4.5 w-4.5 text-primary" />
                    <span className="text-xs font-mono font-bold text-foreground">trycode-mentor-v2.5</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-mono">online</span>
                  </div>
                </div>

                {/* Chat Display Box */}
                <div className="p-6 min-h-[280px] flex flex-col justify-between gap-6 bg-muted/5 font-mono text-xs leading-relaxed">
                  
                  {/* User query bubble */}
                  <div className="flex items-end justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-none px-4 py-2.5 max-w-[85%] font-medium">
                      {QA_MOCK[selectedIdx].question}
                    </div>
                  </div>

                  {/* AI Response bubble */}
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                      AI
                    </div>
                    <div className="bg-background border border-border rounded-2xl rounded-bl-none px-4 py-3 max-w-[85%] text-foreground">
                      <p className="whitespace-pre-wrap">
                        {typedResponse}
                        {isTyping && <span className="inline-block h-3 w-1.5 ml-1 bg-primary animate-pulse" />}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Input simulator footer */}
                <div className="px-5 py-3.5 border-t border-border flex items-center justify-between gap-3 text-muted-foreground/60 text-xs">
                  <span>Type message or select preset questions...</span>
                  <div className="h-7 w-7 rounded-lg bg-muted border border-border flex items-center justify-center">
                    <Send className="h-3.5 w-3.5" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
