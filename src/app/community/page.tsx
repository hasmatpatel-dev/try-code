'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ThumbsUp,
  Heart,
  Search,
  Sparkles,
  MessageCircle,
  Tag,
  Plus,
  X,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Instrument_Serif } from 'next/font/google';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timeAgo: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  liked: boolean;
  tags: string[];
}

const initialPosts: Post[] = [
  {
    id: 'post-1',
    authorName: 'Alex Mercer',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex',
    authorRole: 'Admin',
    timeAgo: '2 hrs ago',
    title: 'Deploying Next.js 16 on Vercel: Edge Cache Pitfalls',
    content: 'Just ran into a caching issue where Server Actions were executing twice under high concurrency on the edge. Resolved it by adjusting request memoization tags. Let me know if you want a detailed tutorial on this!',
    category: 'Q&A',
    likes: 24,
    comments: 8,
    liked: false,
    tags: ['nextjs', 'caching', 'vercel'],
  },
  {
    id: 'post-2',
    authorName: 'Clara Oswald',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=clara',
    authorRole: 'Student',
    timeAgo: '4 hrs ago',
    title: 'Project Showcase: My SaaS dashboard is fully responsive!',
    content: 'Finally finished my CMS student portal. Utilizing Tailwind CSS container queries for components resizing. Fits mobile views like a native app. Would love to hear your feedback on the UX!',
    category: 'Projects',
    likes: 42,
    comments: 15,
    liked: true,
    tags: ['showcase', 'tailwind', 'mobile-design'],
  },
  {
    id: 'post-3',
    authorName: 'James Wilson',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=james',
    authorRole: 'Editor',
    timeAgo: '1 day ago',
    title: 'PostgreSQL Row-Level Security (RLS) configurations',
    content: 'When setting up Supabase client connections, ensure RLS is activated on every user profile relational table. Otherwise, public access can read authentication schemas!',
    category: 'Trending',
    likes: 18,
    comments: 3,
    liked: false,
    tags: ['supabase', 'database', 'security'],
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newTags, setNewTags] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.liked;
          return {
            ...post,
            liked: isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
    const post = posts.find((p) => p.id === postId);
    if (post && !post.liked) {
      toast.success('Post liked!');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { title?: string; content?: string } = {};

    if (!newTitle.trim()) {
      tempErrors.title = 'Please enter a title';
    } else if (newTitle.length < 5) {
      tempErrors.title = 'Title must be at least 5 characters long';
    }

    if (!newContent.trim()) {
      tempErrors.content = 'Please write some content';
    } else if (newContent.length < 15) {
      tempErrors.content = 'Post content must be at least 15 characters';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const tagsArr = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: 'You (Student)',
      authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=current-user',
      authorRole: 'Student',
      timeAgo: 'Just now',
      title: newTitle,
      content: newContent,
      category: newCategory === 'All' ? 'General' : newCategory,
      likes: 0,
      comments: 0,
      liked: false,
      tags: tagsArr.length > 0 ? tagsArr : ['discussion'],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewCategory('General');
    setNewTags('');
    setErrors({});
    setShowComposer(false);
    toast.success('Your post was published in the community feed!');
  };

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === 'All' || post.category === activeTab;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      {/* Background radial glow */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-16 space-y-12 flex flex-col min-h-screen">
            {/* Intro section (Matching Landing / Courses Page Style) */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-border/40">
              <div className="flex flex-col gap-4 max-w-2xl text-left">
                <div className="flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <p className="text-sm text-muted-foreground font-normal tracking-wide uppercase">Community Feed</p>
                </div>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
                  Connect with the{" "}
                  <span className={`${instrumentSerif.className} tracking-tight text-purple-400`}>
                    developer community
                  </span>
                </h1>
                <p className="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
                  Share projects, ask technical questions, and discuss software architectures with fellow developers on TryCode.
                </p>
              </div>

              <button
                onClick={() => setShowComposer(true)}
                className="flex items-center space-x-1.5 rounded-full bg-primary hover:bg-primary/90 px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg active:scale-95 transition-all duration-300 shrink-0"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>New Post</span>
              </button>
            </div>

        {/* Search feed */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </span>
          <input
            type="text"
            placeholder="Search topics, questions, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-background border border-border/40 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-md"
          />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
          {['All', 'Trending', 'Q&A', 'Projects', 'General'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`snap-center shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 border ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>



        {/* Feed Cards List - Optimized full-width layouts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="border-y border-border bg-[#090D1A]/10 hover:bg-[#090D1A]/30 transition duration-300 flex flex-col sm:flex-row justify-between items-stretch">
                {/* Left Content Side */}
                <div className="flex flex-col justify-between gap-6 p-6 xl:p-8 sm:flex-1 text-left">
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-foreground transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm font-normal text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags & Actions */}
                  <div className="space-y-4">
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center text-[10px] font-semibold text-primary/95 border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full">
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          <span>#{tag}</span>
                        </Badge>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-3 text-muted-foreground text-xs">
                      {/* Like reaction */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "flex items-center space-x-1.5 py-1.5 px-3 rounded-full border border-border/40 active:scale-95 transition-all bg-background hover:bg-muted cursor-pointer",
                          post.liked ? "text-red-500 border-red-500/30" : "hover:text-white"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={post.liked ? 'liked' : 'unliked'}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: post.liked ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                post.liked ? "fill-red-500 stroke-red-500" : "text-muted-foreground"
                              )}
                            />
                          </motion.div>
                        </AnimatePresence>
                        <span className="font-bold text-xs">
                          {post.likes}
                        </span>
                      </button>

                      {/* Reply count */}
                      <button
                        onClick={() => toast('Discussions details load dynamically in thread view')}
                        className="flex items-center space-x-1.5 py-1.5 px-4 rounded-full border border-border/40 active:scale-95 transition bg-background hover:bg-muted hover:text-white cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-xs">{post.comments} comments</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Metadata Side (with border-l border-border) */}
                <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l border-border p-6 flex flex-col justify-between gap-6 shrink-0 bg-[#090D1A]/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 text-left">
                      <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-xl bg-background border border-border/40 object-cover" />
                      <div className="text-left">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white leading-tight">{post.authorName}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider text-primary border-primary/30 px-2.5 py-1 rounded-full">
                      {post.authorRole}
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-background border border-border/40 text-muted-foreground px-2.5 py-1 rounded-md">
                      {post.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold">No discussions match your filter.</p>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer02 />

      {/* Centered Composer Dialog */}
      <AnimatePresence>
        {showComposer && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComposer(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog Content Wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-lg rounded-xl border border-border/40 bg-[#090D1A] p-6 shadow-2xl md:p-8 overflow-y-auto max-h-[90vh] z-50"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>

                {/* Header */}
                <div className="mb-6 space-y-1 text-left">
                  <h2 className="text-2xl font-medium text-white tracking-tight">
                    Create a New Discussion
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Post your question, idea, or showcase to the community.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleCreatePost}>
                  <FieldGroup className="gap-5">
                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="title" className="text-sm text-muted-foreground font-normal">
                        Title*
                      </FieldLabel>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g. Next.js 16 Server Actions Error"
                        value={newTitle}
                        onChange={(e) => {
                          setNewTitle(e.target.value);
                          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                        }}
                        className="dark:bg-background shadow-xs h-9 border border-border/40 text-white"
                        required
                      />
                      {errors.title && (
                        <p className="text-xs text-red-500 font-medium">{errors.title}</p>
                      )}
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field className="gap-1.5">
                        <FieldLabel htmlFor="category" className="text-sm text-muted-foreground font-normal">
                          Category*
                        </FieldLabel>
                        <Select
                          onValueChange={(val) => setNewCategory(val ?? 'General')}
                          value={newCategory}
                        >
                          <SelectTrigger className="w-full h-9 dark:bg-background border border-border/40 rounded-lg shadow-xs px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer text-white">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground">
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Q&A">Q&A</SelectItem>
                            <SelectItem value="Projects">Projects</SelectItem>
                            <SelectItem value="Trending">Trending</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field className="gap-1.5">
                        <FieldLabel htmlFor="tags" className="text-sm text-muted-foreground font-normal">
                          Tags (comma-separated)
                        </FieldLabel>
                        <Input
                          id="tags"
                          type="text"
                          placeholder="e.g. react, nextjs, css"
                          value={newTags}
                          onChange={(e) => setNewTags(e.target.value)}
                          className="dark:bg-background shadow-xs h-9 border border-border/40 text-white"
                        />
                      </Field>
                    </div>

                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="content" className="text-sm text-muted-foreground font-normal">
                        Content*
                      </FieldLabel>
                      <Textarea
                        id="content"
                        placeholder="Describe your discussion in detail (min. 15 characters)..."
                        value={newContent}
                        onChange={(e) => {
                          setNewContent(e.target.value);
                          if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                        }}
                        className="dark:bg-background/50 border border-border/40 rounded-lg shadow-xs text-white min-h-[120px]"
                        required
                      />
                      {errors.content && (
                        <p className="text-xs text-red-500 font-medium">{errors.content}</p>
                      )}
                    </Field>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowComposer(false)}
                        className="rounded-lg cursor-pointer h-9 px-4 hover:bg-muted/50 border border-border/40 text-white bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-lg cursor-pointer h-9 px-6 hover:bg-primary/80"
                      >
                        Publish Post
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
