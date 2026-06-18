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

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const fetchPublicPosts = async ({
  search,
  category,
  tag,
  page,
  orderBy,
}: {
  search: string;
  category: string;
  tag: string;
  page: number;
  orderBy: string;
}) => {
  const { data } = await axios.get('/api/posts', {
    params: { search, category, tag, page, status: 'published', limit: 9, orderBy },
  });
  return data;
};

export default function BlogListingPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState('newest');

  // Fetch posts
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['publicPosts', search, selectedCategory, selectedTag, page, orderBy],
    queryFn: () => fetchPublicPosts({ search, category: selectedCategory, tag: selectedTag, page, orderBy }),
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
    if (!text) return '1 min read';
    
    // Clean markdown and HTML code formatting to obtain plain text
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // remove multi-line code blocks
      .replace(/`([^`]+)`/g, '$1')     // remove inline backticks
      .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links, keep text
      .replace(/^#+\s+/gm, '')        // remove header markdown
      .replace(/<[^>]*>/g, '')         // remove HTML tags
      .replace(/^[\s>*+-]+/gm, '');    // remove quotes, list bullets
    
    const wordsPerMinute = 225; // standard tech reading rate
    const wordsCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordsCount / wordsPerMinute));
    return `${minutes} min read`;
  };

  const totalPages = postsData ? Math.ceil(postsData.totalCount / 9) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header className="fixed top-0 z-50 w-full flex" />

      {/* Hero & Listing Wrapper */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border w-full flex flex-col bg-background">
            
            {/* Hero Banner Area */}
            <div className="relative w-full py-16 md:py-24 px-4 md:px-8 before:absolute before:left-0 before:right-0 before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
              <div className="relative z-10 flex flex-col max-w-5xl mx-auto gap-8">
                <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="lg:text-8xl md:text-7xl text-4xl font-medium leading-14 md:leading-20 lg:leading-24"
                  >
                    Articles, guides &{" "} <br />
                    <span
                      className={`${instrumentSerif.className} tracking-tight`}
                    >
                      AI tutorials
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                    className="text-base font-normal max-w-2xl text-muted-foreground leading-relaxed"
                  >
                    Master AI, React, Next.js, WordPress, Elementor, ACF Pro, Webflow, Framer, Testing, Performance, and Architecture through structured roadmaps, practical recipes, curated resources, and AI-powered guidance.
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Search & Filters block */}
            <div className="border-t border-b border-border w-full py-6 px-5 md:px-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-card/10">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {filters?.categories && (
                  <Select
                    value={selectedCategory}
                    onValueChange={(val) => {
                      setSelectedCategory(val === 'all' || !val ? '' : val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px] bg-transparent border-border rounded-full text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {filters.categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.slug || cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filters?.tags && (
                  <Select
                    value={selectedTag}
                    onValueChange={(val) => {
                      setSelectedTag(val === 'all' || !val ? '' : val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[150px] bg-transparent border-border rounded-full text-xs">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {filters.tags.map((tag: any) => (
                        <SelectItem key={tag.id} value={tag.slug || tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={orderBy}
                  onValueChange={(val) => {
                    setOrderBy(val || 'newest');
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-[150px] bg-transparent border-border rounded-full text-xs">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="views">Most Popular</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>

                {(selectedCategory || selectedTag || search || orderBy !== 'newest') && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('');
                      setSelectedTag('');
                      setOrderBy('newest');
                      setPage(1);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground rounded-full px-4 h-9"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Content list */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center border-b border-border">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !postsData || postsData.items.length === 0 ? (
              <div className="py-20 text-center border-b border-border">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground">No articles published yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Please check back later or modify your search filters to list available articles.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {postsData.items.map((post: any, i: number) => (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    key={post.id}
                    className="group flex flex-col md:flex-row border-b border-border last:border-b-0 w-full justify-between overflow-hidden bg-transparent"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col md:flex-row w-full justify-between items-stretch"
                    >
                      {/* Left: Text & Info */}
                      <div className="flex flex-col justify-between flex-1 p-6 md:p-10 gap-6">
                        <div className="space-y-4">
                          {/* Meta inline values */}
                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {estimateReadingTime(post.content)}
                            </span>
                            {post.categories.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {post.categories.map((c: any) => (
                                    <span
                                      key={c.id}
                                      className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/15 px-2 py-0.5 rounded-full"
                                    >
                                      {c.name}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Title & summary */}
                          <h3 className="text-2xl md:text-3xl font-medium text-foreground group-hover:text-foreground/80 transition-colors leading-tight">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm font-normal text-muted-foreground line-clamp-3 leading-relaxed max-w-2xl">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Author detail & CTA link */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={post.author?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author?.email}`}
                              alt={post.author?.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <span className="text-xs text-muted-foreground font-medium">{post.author?.name}</span>
                          </div>
                          <div className="text-xs text-foreground font-semibold flex items-center gap-1 group-hover:underline">
                            Read post
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      {/* Right: Image */}
                      <div className="w-full md:w-[40%] min-h-[200px] md:min-h-full border-t md:border-t-0 md:border-l border-border overflow-hidden relative">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 min-h-[200px]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted/10 text-muted-foreground min-h-[200px]">
                            <BookOpen className="h-10 w-10 opacity-30" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 py-8 border-b border-border bg-card/5 select-none">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 hover:cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 hover:cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer02 />
    </div>
  );
}
