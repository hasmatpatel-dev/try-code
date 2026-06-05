'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  Tag,
  Folder,
} from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';
import { Instrument_Serif } from 'next/font/google';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
});

const fetchPublicPosts = async ({
  search,
  category,
  tag,
  page,
}: {
  search: string;
  category: string;
  tag: string;
  page: number;
}) => {
  const { data } = await axios.get('/api/posts', {
    params: { search, category, tag, page, status: 'published', limit: 9 },
  });
  return data;
};

export default function BlogListingPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);

  // Fetch posts
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['publicPosts', search, selectedCategory, selectedTag, page],
    queryFn: () => fetchPublicPosts({ search, category: selectedCategory, tag: selectedTag, page }),
  });

  // Fetch filters list
  const { data: filters } = useQuery({
    queryKey: ['filtersData'],
    queryFn: async () => {
      const [cats, tgs] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/tags'),
      ]);
      return { categories: cats.data, tags: tgs.data };
    },
  });

  // Helper: Estimate reading time
  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const totalPages = postsData ? Math.ceil(postsData.totalCount / 9) : 0;

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
                <p className="text-sm text-muted-foreground font-normal tracking-wide uppercase">TryCode Blog</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
                Articles, guides &{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-purple-400`}>
                  AI tutorials
                </span>
              </h1>
              <p className="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
                Deep dives into software architecture, full-stack design patterns, Next.js, and database scaling.
              </p>
            </div>

        {/* Search & filters bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#090D1A]/50 border border-[#161C2C] p-4 rounded-2xl backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 left-3 my-auto h-4.5 w-4.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles by keywords..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-[#161C2C] bg-gray-950/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category selection */}
            <Select
              value={selectedCategory || "ALL_CATEGORIES"}
              onValueChange={(val) => {
                setSelectedCategory(val === "ALL_CATEGORIES" ? "" : (val ?? ""));
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl border border-[#161C2C] bg-gray-950 px-3.5 py-2 h-10 text-sm text-white outline-none transition focus:border-purple-500 cursor-pointer max-w-[180px] min-w-[150px] flex items-center justify-between">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
                {filters?.categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag selection */}
            <Select
              value={selectedTag || "ALL_TAGS"}
              onValueChange={(val) => {
                setSelectedTag(val === "ALL_TAGS" ? "" : (val ?? ""));
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl border border-[#161C2C] bg-gray-950 px-3.5 py-2 h-10 text-sm text-white outline-none transition focus:border-purple-500 cursor-pointer max-w-[180px] min-w-[150px] flex items-center justify-between">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="ALL_TAGS">All Tags</SelectItem>
                {filters?.tags.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>
                    #{t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : !postsData || postsData.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#161C2C] py-20 text-center">
            <BookOpen className="h-12 w-12 text-gray-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No articles published yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Please check back later or modify your search filters to list available articles.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Grid of posts */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {postsData.items.map((post: any, i: number) => (
                <motion.article
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  key={post.id}
                  className="group rounded-2xl border border-[#161C2C] bg-[#090D1A]/35 overflow-hidden flex flex-col justify-between shadow-xl hover:border-purple-500/30 transition duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video bg-gray-950 overflow-hidden shrink-0 select-none">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-purple-950/10 text-purple-400">
                        <BookOpen className="h-10 w-10 opacity-40" />
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Meta inline values */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {estimateReadingTime(post.content)}
                        </span>
                      </div>

                      {/* Title & summary */}
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#161C2C]/50">
                      {/* Categories / tags listing */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.categories.map((c: any) => (
                          <span
                            key={c.id}
                            className="text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2 py-0.5 rounded"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>

                      {/* Author detail & CTA link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.author?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author?.email}`}
                            alt={post.author?.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-xs text-gray-300 font-medium">{post.author?.name}</span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs text-purple-400 group-hover:text-purple-300 font-bold flex items-center hover:underline"
                        >
                          Read post
                          <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 select-none">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-4 py-2 text-sm text-gray-300 hover:text-white transition disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-4 py-2 text-sm text-gray-300 hover:text-white transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
        <Footer02 />
      </div>
    </div>
  );
}
