"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";

type BlogData = {
  coverImage: string;
  title: string;
  description: string;
  date: string;
  slug?: string;
};

const placeholderBlogData: BlogData[] = [
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-3-img-1.webp",
    title: "Mastering React & Next.js",
    description:
      "Learn how to build production-grade React apps with the Next.js App Router, Server Components, and modern data fetching patterns.",
    date: "2026-01-01",
    slug: "mastering-react-nextjs",
  },
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-3-img-2.webp",
    title: "The Ultimate Guide to Build a SaaS App",
    description:
      "Step-by-step breakdown of architecting a full-stack SaaS product — from auth and billing to deployment and monitoring.",
    date: "2026-01-03",
    slug: "getting-web-developer-job",
  },
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-3-img-1.webp",
    title: "AI Coding Tools in 2026",
    description:
      "A practical look at how LLMs, Copilot, and agentic coding workflows are reshaping day-to-day software engineering.",
    date: "2026-01-05",
    slug: "ai-coding-tools-2026",
  },
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-3-img-2.webp",
    title: "PostgreSQL & Supabase Deep Dive",
    description:
      "Master Row-Level Security, realtime subscriptions, and edge functions to build secure, scalable backends on Supabase.",
    date: "2026-01-07",
    slug: "postgresql-supabase-deep-dive",
  },
];

const ITEMS_PER_SLIDE = 2;

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch actual published posts from DB
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["homepagePosts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts", {
        params: { status: "published", limit: 4 },
      });
      return data;
    },
  });

  const livePosts = postsData?.items || [];
  const displayData: BlogData[] =
    livePosts.length > 0
      ? livePosts.map((post: any) => ({
          coverImage:
            post.coverImage ||
            "https://images.shadcnspace.com/assets/blog/blog-3-img-1.webp",
          title: post.title,
          description: post.excerpt || "Read the full article on our blog.",
          date: post.createdAt,
          slug: post.slug,
        }))
      : placeholderBlogData;

  const totalSlides = Math.ceil(displayData.length / ITEMS_PER_SLIDE);
  const progress = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 100;

  const prev = useCallback(() => {
    setCurrentSlide((s) => Math.max(0, s - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentSlide((s) => Math.min(totalSlides - 1, s + 1));
  }, [totalSlides]);

  const visibleItems = displayData.slice(
    currentSlide * ITEMS_PER_SLIDE,
    currentSlide * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE
  );

  return (
    <section ref={sectionRef} className="overflow-hidden">
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
                  What&apos;s cooking?
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                Blogs.
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border relative overflow-hidden">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex">
                {visibleItems.map((post, index) => (
                  <motion.div
                    key={`${currentSlide}-${index}`}
                    className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col py-5 h-full bg-transparent group/card"
                    >
                      <div className="flex flex-col sm:flex-row h-full border-y border-border justify-between">
                        {/* Text */}
                        <div className="flex flex-col justify-between gap-6 p-6 xl:p-10 sm:flex-1">
                          <h3 className="text-2xl font-medium text-foreground group-hover/card:text-foreground/80 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm font-normal text-muted-foreground">
                            {post.description}
                          </p>
                        </div>
                        {/* Image */}
                        <div className="w-full sm:w-1/2 h-48 sm:h-full border-l border-border overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="border-x border-border px-12 py-6">
          <motion.div
            className="flex items-center justify-between gap-8 md:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {/* Progress bar */}
            <div className="grow h-0.5 bg-foreground/10 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-foreground transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={currentSlide === 0}
                aria-label="Previous slide"
                className="h-10 w-10 rounded-full border border-foreground/10 bg-white hover:bg-white/90 shadow-sm flex items-center justify-center text-black disabled:opacity-40 disabled:pointer-events-none transition hover:cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={currentSlide >= totalSlides - 1}
                aria-label="Next slide"
                className="h-10 w-10 rounded-full border border-foreground/10 bg-white hover:bg-white/90 shadow-sm flex items-center justify-center text-black disabled:opacity-40 disabled:pointer-events-none transition hover:cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
