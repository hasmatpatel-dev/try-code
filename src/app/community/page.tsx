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
import Header from '@/components/shadcn-space/blocks/hero-01/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-[#030712]">
      <Header className="hidden md:flex" />

      <div className="py-12 px-4 md:py-20 max-w-7xl mx-auto space-y-12">
        {/* Intro section (Matching Landing / Courses Page Style) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="flex flex-col gap-4 max-w-2xl text-left">
            <Badge variant="outline" className="px-3 py-1 h-auto text-sm font-normal w-fit">
              Community
            </Badge>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="h-9 w-9 text-primary animate-pulse" />
              Community Hub
            </h1>
            <p className="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
              Share projects, ask technical questions, and discuss software architectures with fellow developers.
            </p>
          </div>

          <button
            onClick={() => setShowComposer(true)}
            className="flex items-center space-x-1.5 rounded-full bg-primary hover:bg-primary/90 px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg active:scale-95 transition shrink-0"
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

        {/* Post Composer - Interactive Drawer Bottom Sheet */}
        <AnimatePresence>
          {showComposer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowComposer(false)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border/40 bg-[#030712] p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto max-w-2xl mx-auto"
                style={{
                  paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <h3 className="font-semibold text-white text-lg">Write a New Discussion</h3>
                  <button
                    onClick={() => setShowComposer(false)}
                    className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4 text-left">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">TITLE</label>
                    <input
                      type="text"
                      placeholder="Provide a descriptive title for your post..."
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value);
                        if (errors.title) setErrors({ ...errors, title: undefined });
                      }}
                      className={`w-full p-3.5 rounded-2xl bg-background border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.title ? 'border-destructive' : 'border-border/40'
                      }`}
                    />
                    {errors.title && <p className="text-[11px] text-destructive font-semibold">{errors.title}</p>}
                  </div>

                  {/* Category & Tags Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">CATEGORY</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-background border border-border/40 text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="General">General</option>
                        <option value="Q&A">Q&A</option>
                        <option value="Projects">Projects</option>
                        <option value="Trending">Trending</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">TAGS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        placeholder="e.g. nextjs, db"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-background border border-border/40 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">CONTENT</label>
                    <textarea
                      rows={4}
                      placeholder="Write details about your code topic, project, or question here..."
                      value={newContent}
                      onChange={(e) => {
                        setNewContent(e.target.value);
                        if (errors.content) setErrors({ ...errors, content: undefined });
                      }}
                      className={`w-full p-3.5 rounded-2xl bg-background border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.content ? 'border-destructive' : 'border-border/40'
                      }`}
                    />
                    {errors.content && <p className="text-[11px] text-destructive font-semibold">{errors.content}</p>}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary hover:bg-primary/90 py-3.5 text-xs font-bold text-primary-foreground active:scale-95 transition"
                  >
                    Publish Post
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Feed Cards List - Optimized full-width layouts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-muted ring-0 border border-border/40 rounded-2xl shadow-xl hover:shadow-2xl hover:border-border/60 transition duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={post.authorAvatar} alt={post.authorName} className="h-9 w-9 rounded-xl bg-background border border-border/40 object-cover" />
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-white">{post.authorName}</span>
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider text-primary border-primary/30 px-2 py-0.5 rounded-full">
                            {post.authorRole}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground block">{post.timeAgo}</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-background border border-border/40 text-muted-foreground px-2.5 py-1 rounded-md">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-2 text-left">
                    <h3 className="text-base font-semibold text-white leading-snug">{post.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal leading-relaxed">{post.content}</p>
                  </div>

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
                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-muted-foreground text-xs">
                    {/* Like reaction */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex items-center space-x-1.5 py-1.5 px-3 rounded-full border border-border/40 active:scale-95 transition-all bg-background hover:bg-muted",
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
                      className="flex items-center space-x-1.5 py-1.5 px-4 rounded-full border border-border/40 active:scale-95 transition bg-background hover:bg-muted hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold text-xs">{post.comments} comments</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
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
  );
}
