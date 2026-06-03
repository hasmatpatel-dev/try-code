"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type BlogData = {
  coverImage: string;
  title: string;
  date: string;
  slug?: string;
};

const placeholderBlogData: BlogData[] = [
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-1.webp",
    title: "Mastering React & Next.js",
    date: "2026-01-01",
    slug: "mastering-react-nextjs",
  },
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-2.webp",
    title: "Getting a Web Developer Job",
    date: "2026-01-03",
    slug: "getting-web-developer-job",
  },
  {
    coverImage: "https://images.shadcnspace.com/assets/blog/blog-3.webp",
    title: "AI Coding Tools in 2026",
    date: "2026-01-05",
    slug: "ai-coding-tools-2026",
  },
];

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Fetch actual published posts from DB
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["homepagePosts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts", {
        params: { status: "published", limit: 3 },
      });
      return data;
    },
  });

  const livePosts = postsData?.items || [];
  const displayData = livePosts.length > 0 
    ? livePosts.map((post: any) => ({
        coverImage: post.coverImage || "https://images.shadcnspace.com/assets/blog/blog-1.webp",
        title: post.title,
        date: post.createdAt,
        slug: post.slug,
      }))
    : placeholderBlogData;

  return (
    <section ref={sectionRef} className="py-10 md:py-20 bg-[#030712]">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-16">
          {/* header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            {/* title */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="flex flex-col gap-4 justify-center items-start grow"
            >
              {/* Badge */}
              <Badge
                variant={"outline"}
                className="text-sm font-normal py-1 px-3 h-7 text-purple-400 border-purple-500/20"
              >
                Resources
              </Badge>
              {/* Heading */}
              <h2 className="text-white text-3xl sm:text-5xl font-semibold">
                Developer Blog
              </h2>
            </motion.div>
            {/* description */}
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="text-base font-normal text-gray-400 max-w-xl"
            >
              Read the latest articles, programming tutorials, and tech career tips from our core team to master full stack development.
            </motion.p>
          </div>
          
          {/* blogs */}
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayData.map((value: BlogData, index: number) => {
                const formattedDate = new Date(value.date).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                );
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ 
                      duration: 1, 
                      delay: index * 0.2, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Link
                      href={`/blog/${value.slug}`}
                      className="group flex flex-col gap-5 rounded-2xl border border-gray-900 bg-[#090D1A]/30 overflow-hidden shadow-xl hover:border-purple-500/20 transition duration-300"
                    >
                      <div className="w-full aspect-video overflow-hidden relative bg-gray-950 select-none">
                        <img
                          src={value.coverImage}
                          alt={value.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-103"
                        />
                      </div>
                      <div className="p-5 pt-0 flex flex-col gap-2">
                        <p className="text-xs font-normal text-gray-500">
                          {formattedDate}
                        </p>
                        <p className="text-xl font-bold text-white group-hover:text-purple-400 transition leading-snug">
                          {value.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {/* Read more button link */}
          <div className="text-center mt-4">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 px-6 py-2.5 text-sm font-semibold hover:bg-purple-600/20 transition"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
