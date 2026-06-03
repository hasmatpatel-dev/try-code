'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Trash2,
  Loader2,
  Calendar,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CommentsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Spam'>('all');

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const { data } = await axios.get('/api/comments');
      return data;
    },
  });

  // Moderation mutation
  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await axios.put(`/api/comments/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success(`Comment status set to ${variables.status}`);
    },
    onError: () => {
      toast.error('Failed to moderate comment');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this comment permanently?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter comments
  const filteredComments = comments?.filter((item: any) =>
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Comments Moderation</h1>
        <p className="text-sm text-gray-400">Review guest feedback, approve discussions, and filter spam.</p>
      </div>

      {/* Filter toolbar */}
      <div className="flex border-b border-[#161C2C] pb-px select-none">
        {(['all', 'Pending', 'Approved', 'Spam'] as const).map((tab) => {
          const count = comments?.filter((c: any) => tab === 'all' ? true : c.status === tab).length || 0;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                filter === tab
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Comments' : tab}
              <span className="ml-1.5 text-[10px] bg-[#161C2C] px-1.5 py-0.5 rounded-full text-gray-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : !filteredComments || filteredComments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
          <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No comments found</h3>
          <p className="text-sm text-gray-500 mt-1">Comments submitted by guests on your blog posts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((item: any) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-[#090D1A]/30 p-5 shadow-lg backdrop-blur-md flex flex-col md:flex-row md:items-start justify-between gap-4 transition ${
                item.status === 'Pending' ? 'border-purple-500/30 bg-purple-500/[0.02]' : 'border-[#161C2C]'
              }`}
            >
              {/* Commenter info and text */}
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <img
                  src={item.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.authorName}`}
                  alt={item.authorName}
                  className="h-10 w-10 rounded-xl bg-gray-950 p-1 shrink-0 border border-[#161C2C]"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white leading-none">{item.authorName}</span>
                    <span className="text-xs text-gray-500 truncate" title={item.authorEmail}>
                      ({item.authorEmail})
                    </span>
                    <span className="text-xs text-gray-600 select-none">•</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-600" />
                      {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>

                  {/* Comment context */}
                  <p className="text-sm text-gray-300 break-words leading-relaxed whitespace-pre-wrap">{item.content}</p>

                  {/* Linked article details */}
                  {item.post && (
                    <div className="flex items-center space-x-1.5 pt-1.5 text-xs text-gray-500">
                      <MessageCircle className="h-3.5 w-3.5 text-gray-600" />
                      <span>On article:</span>
                      <Link
                        href={`/blog/${item.post.slug}`}
                        target="_blank"
                        className="text-purple-400 hover:text-purple-300 font-semibold flex items-center hover:underline truncate max-w-[250px]"
                      >
                        {item.post.title}
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 md:self-start shrink-0">
                {item.status !== 'Approved' && (
                  <button
                    onClick={() => moderateMutation.mutate({ id: item.id, status: 'Approved' })}
                    className="flex items-center justify-center p-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
                    title="Approve Comment"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {item.status !== 'Rejected' && item.status !== 'Spam' && (
                  <button
                    onClick={() => moderateMutation.mutate({ id: item.id, status: 'Rejected' })}
                    className="flex items-center justify-center p-2 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition"
                    title="Reject Comment"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
                {item.status !== 'Spam' && (
                  <button
                    onClick={() => moderateMutation.mutate({ id: item.id, status: 'Spam' })}
                    className="flex items-center justify-center p-2 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                    title="Flag as Spam"
                  >
                    <AlertOctagon className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center p-2 rounded-xl border border-gray-800 bg-[#090D1A] text-gray-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 transition"
                  title="Delete Comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
