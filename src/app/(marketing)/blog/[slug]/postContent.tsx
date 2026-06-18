'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  FileText,
  Check,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
});

type CommentInputs = z.infer<typeof commentSchema>;

function convertHtmlToMarkdown(html: string): string {
  if (!html) return '';

  let markdown = html;

  // 1. Remove comments
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Pre block code content formatting (to preserve newlines and prevent stripping)
  const preBlocks: string[] = [];
  markdown = markdown.replace(/<pre(?:\s+[^>]*)?>\s*<code(?:\s+class="language-([^"]*)")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, lang, code) => {
    const placeholder = `__PRE_BLOCK_PLACEHOLDER_${preBlocks.length}__`;
    const cleanCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    preBlocks.push(`\`\`\`${lang || ''}\n${cleanCode.trim()}\n\`\`\``);
    return placeholder;
  });

  // 3. Inline code blocks
  markdown = markdown.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (match, code) => {
    const cleanCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return ` \`${cleanCode}\` `;
  });

  // 4. Headers
  markdown = markdown.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  markdown = markdown.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  markdown = markdown.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  markdown = markdown.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // 5. Strong / Bold
  markdown = markdown.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');

  // 6. Emphasis / Italic
  markdown = markdown.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');

  // 7. Links
  markdown = markdown.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // 8. Lists
  markdown = markdown.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '* $1\n');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '\n');

  // 9. Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');

  // 10. Line breaks and paragraphs
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');
  markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // 11. Remove all other HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');

  // 12. Restore pre blocks
  preBlocks.forEach((block, idx) => {
    markdown = markdown.replace(`__PRE_BLOCK_PLACEHOLDER_${idx}__`, `\n${block}\n`);
  });

  // Clean up formatting
  markdown = markdown
    .replace(/\n\s+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return markdown;
}

interface PostContentProps {
  post: any;
  relatedPosts: any[];
}

export default function PostContent({ post, relatedPosts }: PostContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleCopyMarkdown = () => {
    try {
      const frontmatter = [
        '---',
        `title: "${post.title.replace(/"/g, '\\"')}"`,
        post.excerpt ? `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"` : '',
        post.coverImage ? `coverImage: "${post.coverImage}"` : '',
        `date: "${format(new Date(post.createdAt), 'yyyy-MM-dd')}"`,
        post.author?.name ? `author: "${post.author.name}"` : '',
        post.tags && post.tags.length > 0 
          ? `tags:\n${post.tags.map((t: any) => `  - ${t.name}`).join('\n')}` 
          : '',
        '---',
        '',
        convertHtmlToMarkdown(post.content)
      ].filter(Boolean).join('\n');

      navigator.clipboard.writeText(frontmatter);
      setCopiedMd(true);
      toast.success('Markdown content copied!');
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      toast.error('Failed to copy Markdown');
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: '',
      email: '',
      content: '',
    },
  });

  // Extract headings for Table of Contents
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const doc = new DOMParser().parseFromString(post.content, 'text/html');
      const headingElements = doc.querySelectorAll('h1, h2, h3');
      const items: any[] = [];
      headingElements.forEach((el, index) => {
        const text = el.textContent || '';
        const id = `heading-${index}`;
        items.push({
          id,
          text,
          level: parseInt(el.tagName.replace('H', '')),
        });
      });
      setHeadings(items);

      // Inject IDs into the actual rendering container headings and copy buttons for code blocks
      // For simplicity, we match headers and pre blocks in actual DOM
      setTimeout(() => {
        const renderedContainer = document.getElementById('post-content-container');
        if (renderedContainer) {
          const renderedHeadings = renderedContainer.querySelectorAll('h1, h2, h3');
          renderedHeadings.forEach((el, index) => {
            el.setAttribute('id', `heading-${index}`);
          });

          // Inject copy buttons for pre/code blocks
          const existingButtons = renderedContainer.querySelectorAll('.code-copy-button');
          existingButtons.forEach(btn => btn.remove());

          const preElements = renderedContainer.querySelectorAll('pre');
          preElements.forEach((pre) => {
            pre.style.position = 'relative';
            pre.classList.add('group');

            const button = document.createElement('button');
            button.className = 'code-copy-button absolute top-3 right-3 p-1.5 rounded-lg bg-gray-900/90 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100';
            button.setAttribute('type', 'button');
            button.setAttribute('aria-label', 'Copy code');
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            `;

            button.addEventListener('click', async () => {
              const codeElement = pre.querySelector('code');
              const codeText = codeElement ? codeElement.innerText : pre.innerText;
              
              try {
                await navigator.clipboard.writeText(codeText.trim());
                toast.success('Code copied to clipboard!');
                
                button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
                `;
                
                setTimeout(() => {
                  button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  `;
                }, 2000);
              } catch (err) {
                toast.error('Failed to copy code');
              }
            });

            pre.appendChild(button);
          });
        }
      }, 500);
    }
  }, [post.content]);

  // Submit comment mutation
  const commentMutation = useMutation({
    mutationFn: async (values: CommentInputs) => {
      const { data } = await axios.post('/api/comments', {
        postId: post.id,
        content: values.content,
        authorName: values.name,
        authorEmail: values.email,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Comment submitted! It will appear once approved by moderator.');
      reset();
    },
    onError: () => {
      toast.error('Failed to submit comment');
    },
  });

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Article link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text ? text.split(/\s+/).length : 0;
    return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`;
  };

  const onSubmit = (data: CommentInputs) => {
    commentMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      {/* Background radial glow */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

        {/* Section 1: Breadcrumb & Title */}
        <section>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 w-full relative z-10">
            <div className="border-x border-b border-border w-full px-8 lg:px-12 py-10 flex flex-col justify-between items-start gap-6">
              <div className="flex group items-center gap-1">
                <nav aria-label="breadcrumb">
                  <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <li className="inline-flex items-center gap-1">
                      <Link className="transition-colors hover:text-foreground" href="/">
                        Home
                      </Link>
                    </li>
                    <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li className="inline-flex items-center gap-1">
                      <Link className="transition-colors hover:text-foreground" href="/blog">
                        Blog
                      </Link>
                    </li>
                    <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li className="inline-flex items-center gap-1">
                      <span
                        role="link"
                        aria-disabled="true"
                        aria-current="page"
                        className="font-normal text-foreground max-w-[200px] truncate md:max-w-none"
                      >
                        {post.title}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter relative text-left">
                <span className="text-white">
                  {post.title}
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Section 2: Article Cover & Content */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 w-full flex flex-col gap-8">
            <div className="border-x border-border w-full p-8 lg:p-12">
              {post.coverImage && (
                <div className="overflow-hidden mb-8 rounded-xl border border-border/40 max-h-[500px]">
                  <img
                    alt={post.title}
                    loading="lazy"
                    className="w-full object-cover"
                    style={{ color: 'transparent', height: '500px' }}
                    src={post.coverImage}
                  />
                </div>
              )}

              {/* Grid Layout */}
              <div className="grid gap-10 lg:grid-cols-4 items-start">
                {/* Main Content Side */}
                <div className="lg:col-span-3 space-y-8 text-left">
                  {/* Publication Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-2 border-b border-[#161C2C]/50 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author?.email}`}
                        alt={post.author?.name}
                        className="h-6 w-6 rounded-full ring-1 ring-purple-500/20"
                      />
                      <span className="text-gray-300 font-medium">{post.author?.name}</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {estimateReadingTime(post.content)}
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="flex items-center text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer"
                    >
                      {copiedMd ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="blog-details markdown max-w-5xl mx-auto">
                    <article
                      id="post-content-container"
                      className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base md:text-lg focus:outline-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>

                  {/* Bottom tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-[#161C2C]/50">
                      {post.tags.map((t: any) => (
                        <span
                          key={t.id}
                          className="text-xs font-semibold bg-[#111827] text-gray-400 border border-[#1F2937] px-3 py-1 rounded-xl"
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="border-t border-[#161C2C] pt-10 space-y-8">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
                      Comments & Discussions ({post.comments?.length || 0})
                    </h3>

                    {/* Submit Comment Form */}
                    <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl">
                      <h4 className="font-semibold text-white mb-4 text-sm">Join the discussion</h4>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <input
                              type="text"
                              placeholder="Your Name"
                              className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                              {...register('name')}
                            />
                            {errors.name && (
                              <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="email"
                              placeholder="Your Email"
                              className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                              {...register('email')}
                            />
                            {errors.email && (
                              <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <textarea
                            placeholder="Share your thoughts..."
                            rows={4}
                            className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
                            {...register('content')}
                          />
                          {errors.content && (
                            <p className="mt-1 text-[10px] text-red-500">{errors.content.message}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={commentMutation.isPending}
                          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 disabled:opacity-50"
                        >
                          {commentMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                          ) : null}
                          Submit Comment
                        </button>
                      </form>
                    </div>

                    {/* List Comments */}
                    <div className="space-y-4">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment: any) => (
                          <div
                            key={comment.id}
                            className="rounded-2xl border border-[#161C2C]/50 bg-[#090D1A]/20 p-5 space-y-2"
                          >
                            <div className="flex items-center space-x-3 text-xs">
                              <img
                                src={comment.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.authorName}`}
                                alt={comment.authorName}
                                className="h-7 w-7 rounded-lg bg-gray-950 p-0.5 border border-[#161C2C]"
                              />
                              <div>
                                <span className="font-bold text-white block">{comment.authorName}</span>
                                <span className="text-[10px] text-gray-500">
                                  {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-300 pl-10 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-6">
                          No approved comments yet. Be the first to share your thoughts!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar: TOC & Related Posts */}
                <div className="space-y-6 lg:col-span-1 sticky top-6">
                  {/* Table of Contents */}
                  {headings.length > 0 && (
                    <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
                      <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#161C2C] pb-3">
                        Table of Contents
                      </h3>
                      <nav className="space-y-2 max-h-[600px] overflow-y-auto pr-2 select-none text-xs">
                        {headings.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`block font-medium text-gray-400 hover:text-white transition duration-200 truncate ${
                              item.level === 3 ? 'pl-4' : item.level === 2 ? 'pl-2' : ''
                            }`}
                          >
                            {item.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  )}

                  {/* Related Posts */}
                  {relatedPosts && relatedPosts.length > 0 && (
                    <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
                      <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#161C2C] pb-3">
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.map((rel: any) => (
                          <Link
                            key={rel.id}
                            href={`/blog/${rel.slug}`}
                            className="group flex items-start space-x-3 min-w-0"
                          >
                            {rel.coverImage ? (
                              <img
                                src={rel.coverImage}
                                alt={rel.title}
                                className="h-12 w-16 rounded-lg object-cover shrink-0 bg-gray-950 border border-[#161C2C]"
                              />
                            ) : (
                              <div className="h-12 w-16 rounded-lg bg-gray-950 flex items-center justify-center shrink-0 border border-[#161C2C]">
                                <BookOpen className="h-5 w-5 text-gray-700" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition line-clamp-2 leading-snug">
                                {rel.title}
                              </span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">
                                {format(new Date(rel.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer02 />
    </div>
  );
}
