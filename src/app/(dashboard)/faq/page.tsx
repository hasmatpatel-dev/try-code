'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  HelpCircle,
  Search,
  Plus,
  Trash2,
  Globe,
  Eye,
  Loader2,
  GripVertical,
  MessageCircleQuestion,
} from 'lucide-react';
import { toast } from 'sonner';

const fetchFaqs = async () => {
  const { data } = await axios.get('/api/faq');
  return data;
};

export default function FAQPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
  });

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: { question: string; answer: string; published: boolean }) => {
      await axios.post('/api/faq', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setNewQuestion('');
      setNewAnswer('');
      toast.success('FAQ created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create FAQ');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/faq/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete FAQ');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      await axios.put(`/api/faq/${id}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    createMutation.mutate({ question: newQuestion.trim(), answer: newAnswer.trim(), published: false });
  };

  const filtered = (faqs || []).filter((f: any) => {
    const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'published' && f.published) || (filter === 'draft' && !f.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">FAQ</h1>
        <p className="text-sm text-gray-400">Manage frequently asked questions and answers.</p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-5 shadow-md backdrop-blur-md space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <Plus className="h-4 w-4 mr-2 text-purple-400" />
          Add New FAQ
        </h3>
        <input
          type="text"
          placeholder="Enter a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
        />
        <textarea
          placeholder="Enter the answer..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newQuestion.trim() || createMutation.isPending}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add FAQ
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#161C2C] bg-[#090D1A] py-2 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* FAQ List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
          <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No FAQs found</h3>
          <p className="text-sm text-gray-500 mt-1">Add questions and answers for your users.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq: any) => (
            <div key={faq.id} className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-5 shadow-xl backdrop-blur-xl hover:border-purple-500/20 transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <MessageCircleQuestion className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{faq.question}</h3>
                    {faq.answer && (
                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{faq.answer}</p>
                    )}
                    <span className="text-[10px] text-gray-600 mt-2 block">Order: #{faq.order}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-4">
                  {faq.published ? (
                    <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <Globe className="h-3 w-3 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                      <Eye className="h-3 w-3 mr-1" />
                      Draft
                    </span>
                  )}
                  <button
                    onClick={() => togglePublishMutation.mutate({ id: faq.id, published: !faq.published })}
                    className={`p-1.5 rounded-lg border text-[10px] font-semibold transition ${
                      faq.published
                        ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                    }`}
                  >
                    {faq.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
