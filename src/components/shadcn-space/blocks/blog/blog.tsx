"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

type BlogData = {
  coverImage: string;
  title: string;
  description: string;
  date: string;
  slug?: string;
};

const placeholderBlogData: BlogData[] = [
  {
    // A clean, abstract view of an interface overlay / coding workspace
    coverImage: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=285&h=340&fit=crop",
    title: "AI for Developers in 2026",
    description:
      "Explore key prompt engineering guidelines, code agents, LLM integrations, and modern AI-powered tools.",
    date: "2026-06-05",
    slug: "ai-for-developers-2026",
  },
  {
    // Focus purely on a clean JavaScript/TypeScript IDE environment, no misplaced books
    coverImage: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=285&h=340&fit=crop",
    title: "React Performance Checklist",
    description:
      "A complete guide to React 19 compiler, hook optimization, component memoization, and avoiding layout shifts.",
    date: "2026-06-03",
    slug: "react-performance-checklist",
  },
  {
    // A software engineer designing complex system architectures and backend components
    coverImage: "https://images.pexels.com/photos/3183156/pexels-photo-3183156.jpeg?auto=compress&cs=tinysrgb&w=285&h=340&fit=crop",
    title: "Next.js Architecture Guide",
    description:
      "Architect full-stack systems using React Server Components, server actions, route handlers, and Supabase security configurations.",
    date: "2026-06-01",
    slug: "nextjs-architecture-guide",
  },
  {
    // A web designer reviewing typography and UI layouts on a laptop (Webflow, Elementor, Framer style)
    coverImage: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=285&h=340&fit=crop",
    title: "Elementor + ACF Dynamic Websites",
    description:
      "Build dynamic client websites with custom fields, repeaters, custom taxonomies, and high-performance asset loading.",
    date: "2026-05-28",
    slug: "elementor-acf-dynamic-websites",
  },
  {
    // Terminal/Console environments running tests and deployment status indicators
    coverImage: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=285&h=340&fit=crop",
    title: "Modern Testing Strategies",
    description:
      "Configure Playwright and Vitest for continuous integration, visual regressions, and self-healing test automation pipelines.",
    date: "2026-05-25",
    slug: "modern-testing-strategies",
  },
];

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch actual published posts from DB
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["homepagePosts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts", {
        params: { status: "published", limit: 5 },
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

  const prev = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const next = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setProgress(swiper.progress * 100);
  };

  // Sync state on swiper initialization
  useEffect(() => {
    if (swiperInstance) {
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
      setProgress(swiperInstance.progress * 100);
    }
  }, [swiperInstance]);

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
                  Latest Articles
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                Articles.
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
              <Swiper
                onSwiper={setSwiperInstance}
                onSlideChange={handleSlideChange}
                slidesPerView={1}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                }}
                className="w-full"
              >
                {displayData.map((post, index) => (
                  <SwiperSlide key={post.slug || index}>
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
                  </SwiperSlide>
                ))}
              </Swiper>
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
                disabled={isBeginning}
                aria-label="Previous slide"
                className="h-10 w-10 rounded-full border border-foreground/10 bg-white hover:bg-white/90 shadow-sm flex items-center justify-center text-black disabled:opacity-40 disabled:pointer-events-none transition hover:cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={isEnd}
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
