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
    <div className="min-h-screen bg-[#030712] py-4 px-4 md:py-8 md:px-8 space-y-5 relative">
      {/* Intro section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center">
            <Sparkles className="h-6 w-6 mr-1.5 text-purple-500" />
            Community Hub
          </h1>
          <p className="text-[11px] text-gray-400">Share projects and discuss technical topics.</p>
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="flex items-center space-x-1.5 rounded-2xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/10 active:scale-95 transition"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Search feed */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4.5 w-4.5 text-gray-500" />
        </span>
        <input
          type="text"
          placeholder="Search topics, questions, or hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#090D1A] border border-[#161C2C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-md"
        />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {['All', 'Trending', 'Q&A', 'Projects', 'General'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`snap-center shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              activeTab === tab
                ? 'bg-purple-600 text-white border border-purple-500/30'
                : 'bg-[#090D1A] text-gray-400 border border-[#161C2C]'
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
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-[#161C2C] bg-[#090D1A] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              style={{
                paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#161C2C]">
                <h3 className="font-bold text-white text-base">Write a New Discussion</h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-[#161C2C]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-left">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">TITLE</label>
                  <input
                    type="text"
                    placeholder="Provide a descriptive title for your post..."
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: undefined });
                    }}
                    className={`w-full p-3.5 rounded-xl bg-[#030712] border text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 ${
                      errors.title ? 'border-red-500' : 'border-[#161C2C]'
                    }`}
                  />
                  {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title}</p>}
                </div>

                {/* Category & Tags Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">CATEGORY</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#030712] border border-[#161C2C] text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="General">General</option>
                      <option value="Q&A">Q&A</option>
                      <option value="Projects">Projects</option>
                      <option value="Trending">Trending</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">TAGS (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      placeholder="e.g. nextjs, db"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#030712] border border-[#161C2C] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">CONTENT</label>
                  <textarea
                    rows={4}
                    placeholder="Write details about your code topic, project, or question here..."
                    value={newContent}
                    onChange={(e) => {
                      setNewContent(e.target.value);
                      if (errors.content) setErrors({ ...errors, content: undefined });
                    }}
                    className={`w-full p-3.5 rounded-xl bg-[#030712] border text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 ${
                      errors.content ? 'border-red-500' : 'border-[#161C2C]'
                    }`}
                  />
                  {errors.content && <p className="text-[10px] text-red-500 font-bold">{errors.content}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 py-3.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition"
                >
                  Publish Post
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feed Cards List - Optimized full-width layouts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            layout
            key={post.id}
            className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md space-y-3"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img src={post.authorAvatar} alt={post.authorName} className="h-8.5 w-8.5 rounded-xl bg-[#030712]" />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white">{post.authorName}</span>
                    <span className="text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      {post.authorRole}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 block">{post.timeAgo}</span>
                </div>
              </div>

              {/* Category Badge */}
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#161C2C] px-2 py-0.5 rounded-lg text-gray-400">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-1.5 text-left">
              <h3 className="text-sm font-extrabold text-white leading-tight">{post.title}</h3>
              <p className="text-xs text-gray-300 font-normal leading-relaxed">{post.content}</p>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <div key={tag} className="flex items-center text-[10px] font-semibold text-purple-400/90">
                  <Tag className="h-2.5 w-2.5 mr-0.5" />
                  <span>#{tag}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#161C2C]/50 text-gray-400 text-xs">
              {/* Like reaction */}
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1.5 py-1 px-2.5 rounded-xl active:bg-[#161C2C] active:scale-95 transition-all"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={post.liked ? 'liked' : 'unliked'}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: post.liked ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`h-4.5 w-4.5 transition-colors ${
                        post.liked ? 'fill-red-500 stroke-red-500' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>
                <span className={`font-bold text-xs ${post.liked ? 'text-red-500' : 'text-gray-400'}`}>
                  {post.likes}
                </span>
              </button>

              {/* Reply count */}
              <button
                onClick={() => toast('Discussions details load dynamically in thread view')}
                className="flex items-center space-x-1.5 py-1 px-2.5 rounded-xl active:bg-[#161C2C] active:scale-95 transition"
              >
                <MessageCircle className="h-4.5 w-4.5 text-gray-400" />
                <span className="font-bold text-xs">{post.comments} comments</span>
              </button>
            </div>
          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto text-gray-600 mb-1" />
            <p className="text-xs font-semibold">No discussions match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
