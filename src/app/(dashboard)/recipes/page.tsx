'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Code2,
  Search,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Eye,
  Loader2,
  FileCode,
} from 'lucide-react';
import { toast } from 'sonner';

const fetchRecipes = async () => {
  const { data } = await axios.get('/api/recipes');
  return data;
};

const languageColors: Record<string, string> = {
  typescript: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  javascript: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  python: 'text-green-400 bg-green-500/10 border-green-500/20',
  bash: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  css: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

export default function RecipesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      await axios.delete(`/api/recipes/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete recipe');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ slug, published }: { slug: string; published: boolean }) => {
      await axios.put(`/api/recipes/${slug}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteMutation.mutate(slug);
    }
  };

  const filtered = (recipes || []).filter((r: any) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'published' && r.published) || (filter === 'draft' && !r.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Recipes</h1>
          <p className="text-sm text-gray-400">Manage code snippets, dependencies, and best practices.</p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shrink-0"
        >
          <Plus className="mr-2 h-4.5 w-4.5" />
          Create Recipe
        </Link>
      </div>

      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search recipes..."
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
          <Code2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No recipes found</h3>
          <p className="text-sm text-gray-500 mt-1">Create reusable code snippets with AI prompts.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recipe: any) => (
            <div key={recipe.id} className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-5 shadow-xl backdrop-blur-xl hover:border-purple-500/20 transition group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <FileCode className="h-5 w-5 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition text-sm">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{recipe.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-semibold border ${languageColors[recipe.language] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                    {recipe.language}
                  </span>
                  {recipe.published ? (
                    <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => togglePublishMutation.mutate({ slug: recipe.slug, published: !recipe.published })}
                    className={`p-1.5 rounded-lg border text-[10px] font-semibold transition ${
                      recipe.published
                        ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                    }`}
                  >
                    {recipe.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.slug)}
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
