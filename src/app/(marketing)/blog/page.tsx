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
    <div className="relative min-h-screen bg-[#030712] text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative">
        {/* Navigation back home */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl group">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/10">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <span>TryCode <span className="text-purple-400 font-semibold">Blog</span></span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#161C2C] bg-[#090D1A]/50 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition"
          >
            Access CMS
          </Link>
        </div>

        {/* Title Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Articles, Guides & AI Tutorials
          </h1>
          <p className="text-base text-gray-400">
            Deep dives into software architecture, full-stack design patterns, next.js, and database scaling.
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
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[#161C2C] bg-gray-950 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-purple-500 max-w-[180px]"
            >
              <option value="">All Categories</option>
              {filters?.categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Tag selection */}
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[#161C2C] bg-gray-950 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-purple-500 max-w-[180px]"
            >
              <option value="">All Tags</option>
              {filters?.tags.map((t: any) => (
                <option key={t.id} value={t.id}>
                  #{t.name}
                </option>
              ))}
            </select>
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
  );
}
