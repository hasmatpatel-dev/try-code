'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Map,
  Search,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Eye,
  Loader2,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { toast } from 'sonner';

const fetchRoadmaps = async () => {
  const { data } = await axios.get('/api/roadmaps');
  return data;
};

export default function RoadmapsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: fetchRoadmaps,
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      await axios.delete(`/api/roadmaps/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast.success('Roadmap deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete roadmap');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ slug, published }: { slug: string; published: boolean }) => {
      await axios.put(`/api/roadmaps/${slug}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast.success('Roadmap status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this roadmap?')) {
      deleteMutation.mutate(slug);
    }
  };

  const filtered = (roadmaps || []).filter((r: any) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'published' && r.published) || (filter === 'draft' && !r.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Roadmaps</h1>
          <p className="text-sm text-gray-400">Manage learning roadmaps, career paths, and skill tracks.</p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shrink-0"
        >
          <Plus className="mr-2 h-4.5 w-4.5" />
          Create Roadmap
        </Link>
      </div>

      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search roadmaps..."
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

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
          <Map className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No roadmaps found</h3>
          <p className="text-sm text-gray-500 mt-1">Create learning paths to guide your students.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none">
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161C2C] text-sm">
                {filtered.map((roadmap: any) => (
                  <tr key={roadmap.id} className="hover:bg-[#0E1325]/30 transition group">
                    <td className="p-4 pl-6 max-w-xs">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: roadmap.color ? `${roadmap.color}20` : '#1e1b4b' }}>
                          {roadmap.icon || <Map className="h-4 w-4" style={{ color: roadmap.color || '#8B5CF6' }} />}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-white group-hover:text-purple-400 transition">{roadmap.title}</span>
                          {roadmap.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{roadmap.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {roadmap.category ? (
                        <span className="inline-flex items-center rounded-lg bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                          {roadmap.category}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs text-gray-400">#{roadmap.order}</span>
                    </td>
                    <td className="p-4 text-center">
                      {roadmap.published ? (
                        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          <Globe className="h-3 w-3 mr-1.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                          <Eye className="h-3 w-3 mr-1.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => togglePublishMutation.mutate({ slug: roadmap.slug, published: !roadmap.published })}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                            roadmap.published
                              ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                              : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                          }`}
                        >
                          {roadmap.published ? 'Draft' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(roadmap.slug)}
                          className="p-2 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#161C2C] bg-[#090D1A]/50">
            <span className="text-xs text-gray-500">{filtered.length} roadmap{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}
