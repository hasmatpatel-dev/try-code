'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  Globe,
  FileText as DraftIcon,
  Eye,
  Loader2,
  Calendar,
  User as UserIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store';

const fetchPosts = async ({
  page,
  search,
  status,
  category,
  tag,
}: {
  page: number;
  search: string;
  status: string;
  category: string;
  tag: string;
}) => {
  const { data } = await axios.get('/api/posts', {
    params: { page, search, status, category, tag, limit: 8 },
  });
  return data;
};

const fetchFiltersData = async () => {
  const [categoriesRes, tagsRes] = await Promise.all([
    axios.get('/api/categories'),
    axios.get('/api/tags'),
  ]);
  return {
    categories: categoriesRes.data,
    tags: tagsRes.data,
  };
};

export default function PostsPage() {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  // Fetch posts
  const {
    data: postsData,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['posts', page, search, status, category, tag],
    queryFn: () => fetchPosts({ page, search, status, category, tag }),
    placeholderData: (prev) => prev,
  });

  // Fetch category & tag filters
  const { data: filtersData } = useQuery({
    queryKey: ['filtersData'],
    queryFn: fetchFiltersData,
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      await axios.put(`/api/posts/${id}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete post');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = postsData ? Math.ceil(postsData.totalCount / 8) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Articles & Tutorials</h1>
          <p className="text-sm text-gray-400">Create, manage, schedule, and moderate your posts.</p>
        </div>
        <Link
          href="/dashboard/posts/create"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shrink-0"
        >
          <Plus className="mr-2 h-4.5 w-4.5" />
          Create Post
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#161C2C] bg-[#090D1A] py-2 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-purple-500"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>

        {/* Categories */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500 max-w-[200px]"
        >
          <option value="">All Categories</option>
          {filtersData?.categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Tags */}
        <select
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500 max-w-[200px]"
        >
          <option value="">All Tags</option>
          {filtersData?.tags.map((tg: any) => (
            <option key={tg.id} value={tg.id}>
              {tg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : !postsData || postsData.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No posts found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, status filters, or write a brand new post to get started.
          </p>
          <Link
            href="/dashboard/posts/create"
            className="mt-4 inline-flex items-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 px-4 py-2 text-sm font-semibold hover:bg-purple-600/20 transition"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none">
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Views</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161C2C] text-sm">
                {postsData.items.map((post: any) => {
                  const isAuthorOnly =
                    currentUser?.role === 'Author' && post.authorId !== currentUser?.id;

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-[#0E1325]/30 transition group"
                    >
                      {/* Title */}
                      <td className="p-4 pl-6 max-w-xs md:max-w-md">
                        <div className="truncate">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-semibold text-white hover:text-purple-400 transition"
                          >
                            {post.title}
                          </Link>
                          {post.excerpt && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{post.excerpt}</p>
                          )}
                          {/* Categories/Tags inline list */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.categories.map((c: any) => (
                              <span
                                key={c.id}
                                className="text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/15 px-1.5 py-0.2 rounded"
                              >
                                {c.name}
                              </span>
                            ))}
                            {post.tags.map((t: any) => (
                              <span
                                key={t.id}
                                className="text-[10px] font-medium bg-gray-500/15 text-gray-400 border border-gray-500/10 px-1.5 py-0.2 rounded"
                              >
                                #{t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={post.author?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author?.email}`}
                            alt={post.author?.name || 'Author'}
                            className="h-6 w-6 rounded-full object-cover shrink-0"
                          />
                          <span className="truncate max-w-[120px] block">{post.author?.name || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {post.published ? (
                          <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                            <Globe className="h-3 w-3 mr-1.5" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                            <DraftIcon className="h-3 w-3 mr-1.5" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="p-4 text-center text-gray-300 font-bold">
                        <div className="flex items-center justify-center space-x-1">
                          <Eye className="h-3.5 w-3.5 text-gray-500" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-gray-400">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-gray-600" />
                          <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Toggle publish button */}
                          {!isAuthorOnly && (
                            <button
                              onClick={() =>
                                togglePublishMutation.mutate({
                                  id: post.id,
                                  published: !post.published,
                                })
                              }
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                                post.published
                                  ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                                  : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                              }`}
                              title={post.published ? 'Set to Draft' : 'Publish Article'}
                            >
                              {post.published ? 'Draft' : 'Publish'}
                            </button>
                          )}

                          <Link
                            href={`/dashboard/posts/edit/${post.id}`}
                            className={`p-2 rounded-xl border border-[#161C2C] bg-[#090D1A] text-gray-400 hover:text-white hover:bg-gray-800 transition ${
                              isAuthorOnly ? 'pointer-events-none opacity-40' : ''
                            }`}
                            title="Edit post"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={isAuthorOnly}
                            className="p-2 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition disabled:opacity-40"
                            title="Delete post"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#161C2C] bg-[#090D1A]/50 select-none">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-1.5 text-xs text-gray-300 hover:text-white transition disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isPlaceholderData}
                  className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-1.5 text-xs text-gray-300 hover:text-white transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
